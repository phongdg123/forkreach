// src/app/session/layout.tsx
"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ConversationsProvider } from "@/contexts/conversations-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Custom GitHub SVG icon matching the official GitHub mark
const GitHubIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);

export default function SessionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConversationsProvider>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset style={{ marginBottom: "0px" }}>
                    {/* Optional: Header with sidebar toggle */}
                    <header className="flex h-14 items-center gap-4 px-4" style={{ backgroundColor: "rgb(15, 15, 16)" }}>
                        <SidebarTrigger />
                        <h1 className="font-semibold">ForkReach</h1>

                        {/* GitHub icon with star count */}
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors ml-auto"
                        >
                            <GitHubIcon className="h-5 w-5" />
                            {/* <span className="text-sm font-medium">10k</span> */}
                            {/* <GradientButton>Dashboard</GradientButton> */}
                        </Link>
                        <Button>Docs</Button>
                    </header>

                    <div className="flex-1 min-h-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ConversationsProvider>
    );
}