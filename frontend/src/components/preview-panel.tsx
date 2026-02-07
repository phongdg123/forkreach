"use client";

import { useState } from "react";
import {
    MonitorSmartphone,
    Move,
    Search,
    Download,
    Smartphone,
    Monitor,
    ZoomIn,
    ZoomOut,
    Maximize2,
    User,
    Bell,
    Home,
    Settings,
    Menu,
    Star,
    Heart,
    ShoppingCart,
    Image,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

interface PreviewPanelProps {
    designType?: "App" | "Web";
    prompt?: string;
    isLoading?: boolean;
}

// Generate a color palette based on prompt keywords
function generateColorPalette(prompt: string): { primary: string; secondary: string; accent: string; bg: string } {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("red") || lowerPrompt.includes("ferrari") || lowerPrompt.includes("verstappen")) {
        return { primary: "#ef4444", secondary: "#fca5a5", accent: "#dc2626", bg: "#fef2f2" };
    }
    if (lowerPrompt.includes("blue") || lowerPrompt.includes("ocean") || lowerPrompt.includes("sky")) {
        return { primary: "#3b82f6", secondary: "#93c5fd", accent: "#2563eb", bg: "#eff6ff" };
    }
    if (lowerPrompt.includes("green") || lowerPrompt.includes("nature") || lowerPrompt.includes("plant")) {
        return { primary: "#22c55e", secondary: "#86efac", accent: "#16a34a", bg: "#f0fdf4" };
    }
    if (lowerPrompt.includes("orange") || lowerPrompt.includes("autumn") || lowerPrompt.includes("warm")) {
        return { primary: "#f97316", secondary: "#fdba74", accent: "#ea580c", bg: "#fff7ed" };
    }
    if (lowerPrompt.includes("purple") || lowerPrompt.includes("violet") || lowerPrompt.includes("lavender")) {
        return { primary: "#a855f7", secondary: "#d8b4fe", accent: "#9333ea", bg: "#faf5ff" };
    }
    if (lowerPrompt.includes("pink") || lowerPrompt.includes("rose")) {
        return { primary: "#ec4899", secondary: "#f9a8d4", accent: "#db2777", bg: "#fdf2f8" };
    }
    if (lowerPrompt.includes("dark") || lowerPrompt.includes("night") || lowerPrompt.includes("minimal")) {
        return { primary: "#374151", secondary: "#6b7280", accent: "#1f2937", bg: "#f9fafb" };
    }
    if (lowerPrompt.includes("coffee") || lowerPrompt.includes("cafe") || lowerPrompt.includes("brown")) {
        return { primary: "#92400e", secondary: "#d97706", accent: "#78350f", bg: "#fffbeb" };
    }
    // Default modern blue-purple gradient
    return { primary: "#6366f1", secondary: "#a5b4fc", accent: "#4f46e5", bg: "#eef2ff" };
}

// App Mobile Mockup
function AppMockup({ prompt, colors }: { prompt: string; colors: ReturnType<typeof generateColorPalette> }) {
    const lowerPrompt = prompt.toLowerCase();
    const isProfile = lowerPrompt.includes("profile");
    const isCatalog = lowerPrompt.includes("catalog") || lowerPrompt.includes("shop") || lowerPrompt.includes("store");
    const isLanding = lowerPrompt.includes("landing") || lowerPrompt.includes("home");
    const isBlog = lowerPrompt.includes("blog") || lowerPrompt.includes("article");

    return (
        <div className="w-[280px] h-[560px] bg-white rounded-[32px] shadow-2xl overflow-hidden border-8 border-zinc-900 relative">
            {/* Status bar */}
            <div className="h-6 bg-zinc-900 flex items-center justify-between px-4 text-white text-[10px]">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1.5 bg-white rounded-sm"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
                {isProfile ? (
                    // Profile Layout
                    <div className="p-4">
                        {/* Profile Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-16 h-16 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                            <div>
                                <div className="h-4 w-24 rounded mb-2" style={{ backgroundColor: colors.primary }}></div>
                                <div className="h-3 w-16 rounded bg-zinc-200"></div>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="flex justify-around mb-6 p-3 bg-white rounded-xl shadow-sm">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="text-center">
                                    <div className="h-5 w-8 rounded mx-auto mb-1" style={{ backgroundColor: colors.primary }}></div>
                                    <div className="h-2 w-10 rounded bg-zinc-200"></div>
                                </div>
                            ))}
                        </div>
                        {/* Bio section */}
                        <div className="space-y-2 mb-6">
                            <div className="h-3 w-full rounded bg-zinc-200"></div>
                            <div className="h-3 w-4/5 rounded bg-zinc-200"></div>
                            <div className="h-3 w-3/5 rounded bg-zinc-200"></div>
                        </div>
                        {/* Action button */}
                        <button className="w-full py-3 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: colors.primary }}>
                            Follow
                        </button>
                        {/* Grid */}
                        <div className="grid grid-cols-3 gap-2 mt-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square rounded-lg" style={{ backgroundColor: colors.secondary }}></div>
                            ))}
                        </div>
                    </div>
                ) : isCatalog ? (
                    // Catalog/Shop Layout
                    <div className="p-4">
                        {/* Search */}
                        <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl shadow-sm">
                            <Search className="w-4 h-4 text-zinc-400" />
                            <div className="h-3 w-24 rounded bg-zinc-200"></div>
                        </div>
                        {/* Categories */}
                        <div className="flex gap-2 mb-4 overflow-x-auto">
                            {["All", "New", "Sale", "Popular"].map((cat, i) => (
                                <div
                                    key={cat}
                                    className="px-4 py-2 rounded-full text-xs whitespace-nowrap"
                                    style={{
                                        backgroundColor: i === 0 ? colors.primary : "white",
                                        color: i === 0 ? "white" : colors.primary,
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                        {/* Product Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl p-2 shadow-sm">
                                    <div className="aspect-square rounded-lg mb-2" style={{ backgroundColor: colors.secondary }}></div>
                                    <div className="h-3 w-full rounded bg-zinc-200 mb-1"></div>
                                    <div className="h-3 w-12 rounded" style={{ backgroundColor: colors.primary }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Default/Landing Layout
                    <div className="p-4">
                        {/* Hero */}
                        <div className="aspect-video rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                            <div className="text-white text-center">
                                <div className="h-4 w-24 rounded bg-white/30 mx-auto mb-2"></div>
                                <div className="h-3 w-32 rounded bg-white/20 mx-auto"></div>
                            </div>
                        </div>
                        {/* Features */}
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                                    <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: colors.secondary }}></div>
                                    <div className="flex-1">
                                        <div className="h-3 w-20 rounded bg-zinc-200 mb-1"></div>
                                        <div className="h-2 w-full rounded bg-zinc-100"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* CTA */}
                        <button className="w-full py-3 rounded-xl text-white text-sm font-medium mt-4" style={{ backgroundColor: colors.primary }}>
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-100 flex items-center justify-around px-4">
                <Home className="w-5 h-5" style={{ color: colors.primary }} />
                <Search className="w-5 h-5 text-zinc-400" />
                <Heart className="w-5 h-5 text-zinc-400" />
                <User className="w-5 h-5 text-zinc-400" />
            </div>
        </div>
    );
}

// Web Desktop Mockup
function WebMockup({ prompt, colors }: { prompt: string; colors: ReturnType<typeof generateColorPalette> }) {
    const lowerPrompt = prompt.toLowerCase();
    const isBlog = lowerPrompt.includes("blog") || lowerPrompt.includes("article");
    const isLanding = lowerPrompt.includes("landing") || lowerPrompt.includes("home");
    const isPortfolio = lowerPrompt.includes("portfolio") || lowerPrompt.includes("personal");
    const isCatalog = lowerPrompt.includes("catalog") || lowerPrompt.includes("shop") || lowerPrompt.includes("store");

    return (
        <div className="w-[600px] h-[400px] bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-200">
            {/* Browser Chrome */}
            <div className="h-8 bg-zinc-100 flex items-center px-3 gap-2 border-b border-zinc-200">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                    <div className="h-5 bg-white rounded-full px-3 flex items-center">
                        <div className="h-2 w-32 rounded bg-zinc-200"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
                {/* Nav */}
                <nav className="h-12 bg-white border-b border-zinc-100 flex items-center justify-between px-6">
                    <div className="h-4 w-20 rounded" style={{ backgroundColor: colors.primary }}></div>
                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-3 w-12 rounded bg-zinc-200"></div>
                        ))}
                        <button className="px-4 py-1.5 rounded-lg text-white text-xs" style={{ backgroundColor: colors.primary }}>
                            Sign Up
                        </button>
                    </div>
                </nav>

                {isPortfolio || isBlog ? (
                    // Portfolio/Blog Layout
                    <div className="p-6 flex gap-6">
                        {/* Sidebar */}
                        <div className="w-48">
                            <div className="w-24 h-24 rounded-full mx-auto mb-4" style={{ backgroundColor: colors.primary }}></div>
                            <div className="h-4 w-32 rounded bg-zinc-200 mx-auto mb-2"></div>
                            <div className="h-3 w-24 rounded bg-zinc-100 mx-auto mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-2 w-full rounded bg-zinc-200"></div>
                                <div className="h-2 w-4/5 rounded bg-zinc-200"></div>
                                <div className="h-2 w-3/5 rounded bg-zinc-200"></div>
                            </div>
                        </div>
                        {/* Content Grid */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                                    <div className="aspect-video rounded-lg mb-2" style={{ backgroundColor: colors.secondary }}></div>
                                    <div className="h-3 w-3/4 rounded bg-zinc-200 mb-1"></div>
                                    <div className="h-2 w-full rounded bg-zinc-100"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : isCatalog ? (
                    // E-commerce Layout
                    <div className="p-6">
                        {/* Hero Banner */}
                        <div className="h-32 rounded-xl mb-6 flex items-center justify-between px-8" style={{ backgroundColor: colors.primary }}>
                            <div>
                                <div className="h-5 w-40 rounded bg-white/30 mb-2"></div>
                                <div className="h-3 w-56 rounded bg-white/20 mb-3"></div>
                                <button className="px-4 py-2 rounded-lg bg-white text-xs" style={{ color: colors.primary }}>
                                    Shop Now
                                </button>
                            </div>
                            <div className="w-24 h-24 rounded-xl" style={{ backgroundColor: colors.secondary }}></div>
                        </div>
                        {/* Product Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                                    <div className="aspect-square rounded-lg mb-2" style={{ backgroundColor: colors.secondary }}></div>
                                    <div className="h-3 w-full rounded bg-zinc-200 mb-1"></div>
                                    <div className="h-3 w-12 rounded" style={{ backgroundColor: colors.primary }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Default Landing Layout
                    <div className="p-6">
                        {/* Hero */}
                        <div className="flex items-center gap-8 mb-8">
                            <div className="flex-1">
                                <div className="h-6 w-4/5 rounded mb-3" style={{ backgroundColor: colors.primary }}></div>
                                <div className="h-4 w-3/4 rounded bg-zinc-200 mb-2"></div>
                                <div className="h-4 w-2/3 rounded bg-zinc-200 mb-4"></div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: colors.primary }}>
                                        Get Started
                                    </button>
                                    <button className="px-6 py-2 rounded-lg border text-sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                                        Learn More
                                    </button>
                                </div>
                            </div>
                            <div className="w-48 h-36 rounded-xl" style={{ backgroundColor: colors.secondary }}></div>
                        </div>
                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="w-10 h-10 rounded-lg mb-3" style={{ backgroundColor: colors.secondary }}></div>
                                    <div className="h-4 w-24 rounded bg-zinc-200 mb-2"></div>
                                    <div className="h-2 w-full rounded bg-zinc-100"></div>
                                    <div className="h-2 w-4/5 rounded bg-zinc-100 mt-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function PreviewPanel({ designType = "App", prompt = "", isLoading = false }: PreviewPanelProps) {
    const [viewMode, setViewMode] = useState<"mobile" | "desktop">(designType === "App" ? "mobile" : "desktop");
    const [zoom, setZoom] = useState(100);

    const colors = generateColorPalette(prompt);

    return (
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 flex flex-col">
            {/* Preview area */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <div className="w-16 h-16 border-4 border-zinc-300 dark:border-zinc-600 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm">Generating your design...</p>
                    </div>
                ) : !prompt ? (
                    <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
                        <MonitorSmartphone className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-sm">Your design preview will appear here</p>
                    </div>
                ) : (
                    <div style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.2s" }}>
                        {viewMode === "mobile" ? (
                            <AppMockup prompt={prompt} colors={colors} />
                        ) : (
                            <WebMockup prompt={prompt} colors={colors} />
                        )}
                    </div>
                )}
            </div>

            {/* Footer controls */}
            <div className="h-14 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4">
                {/* Zoom controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg min-w-[60px] text-center">
                        {zoom}%
                    </span>
                    <button
                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                        className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setZoom(100)}
                        className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode("mobile")}
                        className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${viewMode === "mobile"
                                ? "bg-blue-600 text-white"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            }`}
                    >
                        <Smartphone className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("desktop")}
                        className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${viewMode === "desktop"
                                ? "bg-blue-600 text-white"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            }`}
                    >
                        <Monitor className="h-4 w-4" />
                    </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                        <Move className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
