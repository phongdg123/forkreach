"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    useConversations,
    Conversation,
    ConversationMessage,
} from "@/hooks/useConversations";
import { MessageMetadata } from "@/lib/api";

interface ConversationsContextType {
    conversations: Conversation[];
    isLoaded: boolean;
    isLoading: boolean;
    createConversation: () => Promise<string>;
    getConversation: (id: string) => Conversation | undefined;
    fetchConversationMessages: (id: string) => Promise<Conversation | undefined>;
    updateConversationMessages: (id: string, messages: ConversationMessage[]) => Promise<void>;
    addMessageToConversation: (
        conversationId: string,
        role: "user" | "assistant",
        content: string,
        metadata?: MessageMetadata
    ) => Promise<ConversationMessage | undefined>;
    groupedConversations: () => { label: string; conversations: Conversation[] }[];
    navigateToNewChat: () => Promise<void>;
    navigateToChat: (id: string) => void;
}

const ConversationsContext = createContext<ConversationsContextType | null>(null);

export function ConversationsProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const {
        conversations,
        isLoaded,
        isLoading,
        createConversation,
        getConversation,
        fetchConversationMessages,
        updateConversationMessages,
        addMessageToConversation,
        groupedConversations,
    } = useConversations();

    const navigateToNewChat = useCallback(async () => {
        const newId = await createConversation();
        router.push(`/session/${newId}`);
    }, [createConversation, router]);

    const navigateToChat = useCallback(
        (id: string) => {
            router.push(`/session/${id}`);
        },
        [router]
    );

    return (
        <ConversationsContext.Provider
            value={{
                conversations,
                isLoaded,
                isLoading,
                createConversation,
                getConversation,
                fetchConversationMessages,
                updateConversationMessages,
                addMessageToConversation,
                groupedConversations,
                navigateToNewChat,
                navigateToChat,
            }}
        >
            {children}
        </ConversationsContext.Provider>
    );
}

export function useConversationsContext() {
    const context = useContext(ConversationsContext);
    if (!context) {
        throw new Error(
            "useConversationsContext must be used within a ConversationsProvider"
        );
    }
    return context;
}
