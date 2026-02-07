"""
Product Context API for storing and managing brand/product information.

Endpoints:
- GET /api/products - Get all products for a device
- GET /api/products/{id} - Get a specific product
- POST /api/products - Create or update a product
- DELETE /api/products/{id} - Delete a product
"""

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
from supabase_client import supabase

router = APIRouter()


class ProductCreate(BaseModel):
    """Request body for creating/updating a product."""
    name: str
    tagline: Optional[str] = None
    target_audience: Optional[str] = None
    key_features: Optional[List[str]] = None
    brand_voice: str = "casual"


class ProductResponse(BaseModel):
    """Response model for product data."""
    id: str
    device_id: str
    name: str
    tagline: Optional[str]
    target_audience: Optional[str]
    key_features: Optional[List[str]]
    brand_voice: str
    created_at: str
    updated_at: str


@router.get("/api/products")
async def get_products(x_device_id: str = Header(...)):
    """Get all products for a device."""
    try:
        response = supabase.table("products").select("*").eq("device_id", x_device_id).order("updated_at", desc=True).execute()
        return {"products": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/products/{product_id}")
async def get_product(product_id: str, x_device_id: str = Header(...)):
    """Get a specific product by ID."""
    try:
        response = supabase.table("products").select("*").eq("id", product_id).eq("device_id", x_device_id).single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/products")
async def create_product(product: ProductCreate, x_device_id: str = Header(...)):
    """Create a new product or update if name exists."""
    try:
        # Check if product with same name exists for this device
        existing = supabase.table("products").select("id").eq("device_id", x_device_id).eq("name", product.name).execute()
        
        product_data = {
            "device_id": x_device_id,
            "name": product.name,
            "tagline": product.tagline,
            "target_audience": product.target_audience,
            "key_features": product.key_features or [],
            "brand_voice": product.brand_voice,
        }
        
        if existing.data:
            # Update existing product
            product_id = existing.data[0]["id"]
            response = supabase.table("products").update(product_data).eq("id", product_id).execute()
        else:
            # Create new product
            response = supabase.table("products").insert(product_data).execute()
        
        return {"product": response.data[0] if response.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/api/products/{product_id}")
async def delete_product(product_id: str, x_device_id: str = Header(...)):
    """Delete a product."""
    try:
        response = supabase.table("products").delete().eq("id", product_id).eq("device_id", x_device_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
