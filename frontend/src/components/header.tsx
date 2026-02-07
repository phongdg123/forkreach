"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, MoreVertical } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
    return (
        <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Left side */}
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                )}
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-white">Stitch</span>
                    <span className="hidden sm:inline text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                        BETA
                    </span>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-4">
                <ThemeToggle />
                <button className="hidden sm:flex text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                    <MoreVertical className="h-5 w-5" />
                </button>
                <Avatar className="h-8 w-8 bg-amber-500">
                    <AvatarFallback className="bg-amber-500 text-white text-sm font-medium">
                        J
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
