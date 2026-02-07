"use client";

import { useState, useEffect, useCallback } from "react";
import {
    listProducts,
    createProduct,
    deleteProduct,
    type Product,
    type ProductCreate
} from "@/lib/api";

const ACTIVE_PRODUCT_KEY = "active_product_id";

export function useProductContext() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Load products from API
    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await listProducts();
            setProducts(data);

            // Restore active product from localStorage
            const savedActiveId = localStorage.getItem(ACTIVE_PRODUCT_KEY);
            if (savedActiveId) {
                const active = data.find(p => p.id === savedActiveId);
                if (active) {
                    setActiveProduct(active);
                } else if (data.length > 0) {
                    // Fallback to first product if saved one doesn't exist
                    setActiveProduct(data[0]);
                    localStorage.setItem(ACTIVE_PRODUCT_KEY, data[0].id);
                }
            } else if (data.length > 0) {
                // Default to first product
                setActiveProduct(data[0]);
                localStorage.setItem(ACTIVE_PRODUCT_KEY, data[0].id);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Save or update product
    const saveProduct = useCallback(async (data: ProductCreate) => {
        try {
            setIsSaving(true);
            setError(null);
            const saved = await createProduct(data);

            // Refresh products list
            await fetchProducts();

            // Set as active
            setActiveProduct(saved);
            localStorage.setItem(ACTIVE_PRODUCT_KEY, saved.id);

            return saved;
        } catch (err) {
            console.error("Error saving product:", err);
            setError(err instanceof Error ? err.message : "Failed to save product");
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [fetchProducts]);

    // Delete product
    const removeProduct = useCallback(async (productId: string) => {
        try {
            setError(null);
            await deleteProduct(productId);

            // Clear active if we deleted it
            if (activeProduct?.id === productId) {
                setActiveProduct(null);
                localStorage.removeItem(ACTIVE_PRODUCT_KEY);
            }

            // Refresh list
            await fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
            setError(err instanceof Error ? err.message : "Failed to delete product");
            throw err;
        }
    }, [activeProduct?.id, fetchProducts]);

    // Set active product
    const selectProduct = useCallback((product: Product | null) => {
        setActiveProduct(product);
        if (product) {
            localStorage.setItem(ACTIVE_PRODUCT_KEY, product.id);
        } else {
            localStorage.removeItem(ACTIVE_PRODUCT_KEY);
        }
    }, []);

    // Convert active product to the format expected by the chat API
    const getProductContextForChat = useCallback(() => {
        if (!activeProduct) return null;

        return {
            name: activeProduct.name,
            tagline: activeProduct.tagline,
            target_audience: activeProduct.target_audience,
            key_features: activeProduct.key_features,
            brand_voice: activeProduct.brand_voice,
        };
    }, [activeProduct]);

    return {
        products,
        activeProduct,
        isLoading,
        isSaving,
        error,
        saveProduct,
        removeProduct,
        selectProduct,
        refetch: fetchProducts,
        getProductContextForChat,
    };
}
