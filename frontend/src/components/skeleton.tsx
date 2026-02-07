import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800",
                className
            )}
        />
    );
}

// Project item skeleton for sidebar
function ProjectSkeleton() {
    return (
        <div className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-3 w-12" />
            </div>
        </div>
    );
}

// Sidebar loading skeleton
function SidebarSkeleton() {
    return (
        <div className="space-y-1">
            {/* Section title */}
            <Skeleton className="h-3 w-16 ml-3 mb-2" />
            {/* Project items */}
            {[1, 2, 3, 4, 5].map((i) => (
                <ProjectSkeleton key={i} />
            ))}
        </div>
    );
}

// Chat message skeleton
function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className={`flex-1 max-w-[80%] ${isUser ? "flex flex-col items-end" : ""}`}>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}

// Chat panel loading skeleton
function ChatPanelSkeleton() {
    return (
        <div className="p-4 space-y-6">
            <ChatMessageSkeleton />
            <ChatMessageSkeleton isUser />
            <ChatMessageSkeleton />
        </div>
    );
}

// Preview panel loading skeleton
function PreviewPanelSkeleton() {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-64 h-[480px] rounded-3xl overflow-hidden">
                {/* Phone frame skeleton */}
                <Skeleton className="w-full h-6" />
                <div className="p-4 space-y-4 bg-zinc-100 dark:bg-zinc-800 h-full">
                    <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                    <Skeleton className="h-5 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <div className="flex justify-around py-4">
                        <div className="text-center">
                            <Skeleton className="h-5 w-10 mx-auto mb-1" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <div className="text-center">
                            <Skeleton className="h-5 w-10 mx-auto mb-1" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                        <div className="text-center">
                            <Skeleton className="h-5 w-10 mx-auto mb-1" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                        <Skeleton className="aspect-square rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Project header skeleton
function ProjectHeaderSkeleton() {
    return (
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-12 h-5 rounded" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-20 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        </div>
    );
}

// Design input loading skeleton (for when navigating)
function DesignInputSkeleton() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="w-full max-w-2xl">
                <div className="flex items-center justify-center gap-3 mb-10">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-40 w-full rounded-2xl mb-8" />
                <div className="space-y-3">
                    <Skeleton className="h-4 w-28 mb-4" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export {
    Skeleton,
    ProjectSkeleton,
    SidebarSkeleton,
    ChatMessageSkeleton,
    ChatPanelSkeleton,
    PreviewPanelSkeleton,
    ProjectHeaderSkeleton,
    DesignInputSkeleton,
};
