"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, Check, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Toast types
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

// Helper function to generate unique IDs
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const icons = {
        success: <Check className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
    };

    const colors = {
        success: "bg-emerald-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-amber-500 text-white",
        info: "bg-blue-500 text-white",
    };

    const bgColors = {
        success: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
        error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
        warning: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
        info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    };

    const textColors = {
        success: "text-emerald-900 dark:text-emerald-100",
        error: "text-red-900 dark:text-red-100",
        warning: "text-amber-900 dark:text-amber-100",
        info: "text-blue-900 dark:text-blue-100",
    };

    return (
        <div
            className={`
                flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
                animate-in slide-in-from-right-full duration-300
                ${bgColors[toast.type]}
            `}
            role="alert"
        >
            <div className={`p-1 rounded-full ${colors[toast.type]}`}>
                {icons[toast.type]}
            </div>
            <p className={`flex-1 text-sm font-medium ${textColors[toast.type]}`}>
                {toast.message}
            </p>
            <button
                onClick={onRemove}
                className={`p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${textColors[toast.type]}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Toast Provider Component
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info", duration: number = 4000) => {
        const id = generateId();
        const newToast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Convenience functions for common toast types
export const toast = {
    success: (message: string, duration?: number) => {
        // This will be used via the hook
        console.log("Toast success:", message);
    },
    error: (message: string, duration?: number) => {
        console.log("Toast error:", message);
    },
    info: (message: string, duration?: number) => {
        console.log("Toast info:", message);
    },
    warning: (message: string, duration?: number) => {
        console.log("Toast warning:", message);
    },
};
