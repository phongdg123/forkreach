"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Monitor } from "lucide-react";
import { createDesign } from "@/lib/api";
import { useToast } from "@/components/toast";
import AI_Prompt from "@/components/kokonutui/ai-prompt";

type DesignType = "App" | "Web";

export function DesignInput() {
    const router = useRouter();
    const { addToast } = useToast();
    const [designType, setDesignType] = useState<DesignType>("App");
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const promptSuggestions = [
        "Profile page for Formula One driver Max Verstappen, featuring pastel red as the primary color",
        "Make a catalog page with seasonal home decor items, listed in a minimalist grid layout with images, with seasons as filters. Light orange theme",
    ];

    const handleSubmit = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const project = await createDesign({
                prompt: prompt.trim(),
                design_type: designType,
            });
            addToast("Design project created!", "success");
            // Navigate to projects page with the new project ID
            router.push(`/projects?id=${project.id}`);
        } catch (error) {
            console.error("Failed to create design:", error);
            addToast("Failed to create design. Please try again.", "error");
            // Still navigate even if API fails (for demo purposes)
            router.push("/projects");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-8 bg-white dark:bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-2xl">
                {/* Start a new section */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6 md:mb-10">
                    <span className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg">Start a new</span>
                    <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                        <button
                            onClick={() => setDesignType("App")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-colors ${designType === "App"
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                            App
                        </button>
                        <button
                            onClick={() => setDesignType("Web")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition-colors ${designType === "Web"
                                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                }`}
                        >
                            <Monitor className="h-4 w-4" />
                            Web
                        </button>
                    </div>
                    <span className="text-zinc-900 dark:text-white text-lg font-medium">design</span>
                </div>

                {/* Input area */}
                <AI_Prompt
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    placeholder="Describe your design"
                    disabled={isLoading}
                    showHeader={false}
                />

                {/* Prompt suggestions */}
                <div>
                    <p className="text-zinc-500 dark:text-zinc-500 text-sm mb-4">Try these prompts</p>
                    <div className="space-y-3">
                        {promptSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => setPrompt(suggestion)}
                                disabled={isLoading}
                                className="w-full text-left px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
