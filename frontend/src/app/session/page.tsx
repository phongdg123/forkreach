"use client";

import { useEffect } from "react";
import { useConversationsContext } from "@/contexts/conversations-context";

export default function Session() {
    const { navigateToNewChat, isLoaded } = useConversationsContext();

    // Automatically redirect to a new chat when visiting /session
    useEffect(() => {
        if (isLoaded) {
            navigateToNewChat();
        }
    }, [isLoaded, navigateToNewChat]);

    // Show loading state while redirecting
    return (
        <main
            className="flex flex-col justify-center items-center h-full"
            style={{ backgroundColor: "rgb(15, 15, 16)" }}
        >
            <div className="text-white/60">Loading...</div>
        </main>
    );
}