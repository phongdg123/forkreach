/**
 * AgentSelector - Forked from ModelSelector
 * 
 * A Command/Dialog-based selector for marketing agents.
 * Uses emoji/text instead of provider logos.
 */

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

// ============================================
// Core Dialog Components
// ============================================

export type AgentSelectorProps = ComponentProps<typeof Dialog>;

export const AgentSelector = (props: AgentSelectorProps) => (
    <Dialog {...props} />
);

export type AgentSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const AgentSelectorTrigger = (props: AgentSelectorTriggerProps) => (
    <DialogTrigger {...props} />
);

export type AgentSelectorContentProps = ComponentProps<typeof DialogContent> & {
    title?: ReactNode;
};

export const AgentSelectorContent = ({
    className,
    children,
    title = "Select Agent",
    ...props
}: AgentSelectorContentProps) => (
    <DialogContent className={cn("p-0", className)} {...props}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <Command className="**:data-[slot=command-input-wrapper]:h-auto">
            {children}
        </Command>
    </DialogContent>
);

export type AgentSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export const AgentSelectorDialog = (props: AgentSelectorDialogProps) => (
    <CommandDialog {...props} />
);

// ============================================
// Command Components
// ============================================

export type AgentSelectorInputProps = ComponentProps<typeof CommandInput>;

export const AgentSelectorInput = ({
    className,
    ...props
}: AgentSelectorInputProps) => (
    <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type AgentSelectorListProps = ComponentProps<typeof CommandList>;

export const AgentSelectorList = (props: AgentSelectorListProps) => (
    <CommandList {...props} />
);

export type AgentSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const AgentSelectorEmpty = (props: AgentSelectorEmptyProps) => (
    <CommandEmpty {...props} />
);

export type AgentSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const AgentSelectorGroup = (props: AgentSelectorGroupProps) => (
    <CommandGroup {...props} />
);

export type AgentSelectorItemProps = ComponentProps<typeof CommandItem>;

export const AgentSelectorItem = (props: AgentSelectorItemProps) => (
    <CommandItem {...props} />
);

export type AgentSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const AgentSelectorShortcut = (props: AgentSelectorShortcutProps) => (
    <CommandShortcut {...props} />
);

export type AgentSelectorSeparatorProps = ComponentProps<
    typeof CommandSeparator
>;

export const AgentSelectorSeparator = (props: AgentSelectorSeparatorProps) => (
    <CommandSeparator {...props} />
);

// ============================================
// Agent-Specific Components (replaces Logo components)
// ============================================

export type AgentSelectorIconProps = ComponentProps<"span"> & {
    icon: string; // Lucide icon name (e.g., "twitter", "rocket") or fallback text
};

// Map icon names to Lucide components
import { Twitter, Rocket, FileText, Mail, Sparkles, Bot, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    twitter: Twitter,
    rocket: Rocket,
    "file-text": FileText,
    mail: Mail,
    sparkles: Sparkles,
    bot: Bot,
};

export const AgentSelectorIcon = ({
    icon,
    className,
    ...props
}: AgentSelectorIconProps) => {
    const IconComponent = iconMap[icon];

    if (IconComponent) {
        return (
            <span {...props} className={cn("flex-shrink-0", className)}>
                <IconComponent className="h-4 w-4" />
            </span>
        );
    }

    // Fallback to text/emoji if no matching icon
    return (
        <span
            {...props}
            className={cn("text-base flex-shrink-0", className)}
            role="img"
            aria-hidden="true"
        >
            {icon}
        </span>
    );
};

export type AgentSelectorNameProps = ComponentProps<"span">;

export const AgentSelectorName = ({
    className,
    ...props
}: AgentSelectorNameProps) => (
    <span className={cn("flex-1 truncate text-left", className)} {...props} />
);

export type AgentSelectorDescriptionProps = ComponentProps<"span">;

export const AgentSelectorDescription = ({
    className,
    ...props
}: AgentSelectorDescriptionProps) => (
    <span
        className={cn("text-xs text-muted-foreground truncate", className)}
        {...props}
    />
);

// ============================================
// Agent data type
// ============================================

export interface Agent {
    id: string;
    name: string;
    icon: string;
    description: string;
    capabilities?: string[];
}

// Default agents
export const defaultAgents: Agent[] = [
    {
        id: "auto",
        name: "Auto",
        icon: "sparkles",
        description: "Let AI choose the best agent",
        capabilities: ["Automatic routing", "Intent detection"],
    },
    {
        id: "twitter",
        name: "Twitter/X",
        icon: "twitter",
        description: "Create threads, posts, and build-in-public content",
        capabilities: [
            "Thread generation",
            "Build-in-public",
            "Launch announcements",
            "Engagement hooks",
        ],
    },
];
