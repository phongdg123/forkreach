"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Plus, Loader2 } from "lucide-react";
import { type ProductCreate, type Product } from "@/lib/api";

interface ProductContextModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: ProductCreate) => Promise<unknown>;
    initialData?: Product | null;
    isSaving?: boolean;
}

export function ProductContextModal({
    open,
    onOpenChange,
    onSave,
    initialData,
    isSaving = false,
}: ProductContextModalProps) {
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState("");
    const [brandVoice, setBrandVoice] = useState<"casual" | "professional" | "playful">("casual");

    // Populate form when initialData changes
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setTagline(initialData.tagline || "");
            setTargetAudience(initialData.target_audience || "");
            setKeyFeatures(initialData.key_features || []);
            setBrandVoice((initialData.brand_voice as "casual" | "professional" | "playful") || "casual");
        } else {
            // Reset form for new product
            setName("");
            setTagline("");
            setTargetAudience("");
            setKeyFeatures([]);
            setBrandVoice("casual");
        }
    }, [initialData, open]);

    const handleAddFeature = () => {
        const trimmed = newFeature.trim();
        if (trimmed && !keyFeatures.includes(trimmed)) {
            setKeyFeatures([...keyFeatures, trimmed]);
            setNewFeature("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddFeature();
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) return;

        await onSave({
            name: name.trim(),
            tagline: tagline.trim() || undefined,
            target_audience: targetAudience.trim() || undefined,
            key_features: keyFeatures.length > 0 ? keyFeatures : undefined,
            brand_voice: brandVoice,
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Brand Setup</DialogTitle>
                    <DialogDescription>
                        Set up your product or brand context. This helps the AI generate
                        personalized marketing content.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Product Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., TaskFlow"
                        />
                    </div>

                    {/* Tagline */}
                    <div className="grid gap-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g., Simple task management for indie hackers"
                        />
                    </div>

                    {/* Target Audience */}
                    <div className="grid gap-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Textarea
                            id="audience"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g., Solo founders and small teams building SaaS products"
                            className="resize-none"
                            rows={2}
                        />
                    </div>

                    {/* Key Features */}
                    <div className="grid gap-2">
                        <Label>Key Features</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a feature..."
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddFeature}
                                disabled={!newFeature.trim()}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {keyFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {keyFeatures.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Brand Voice */}
                    <div className="grid gap-2">
                        <Label htmlFor="voice">Brand Voice</Label>
                        <Select value={brandVoice} onValueChange={(v) => setBrandVoice(v as typeof brandVoice)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select brand voice" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="casual">
                                    😊 Casual - Friendly and approachable
                                </SelectItem>
                                <SelectItem value="professional">
                                    💼 Professional - Formal and authoritative
                                </SelectItem>
                                <SelectItem value="playful">
                                    🎮 Playful - Fun and energetic
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!name.trim() || isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
