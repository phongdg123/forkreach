"use client";

import { useState, useEffect, useCallback } from "react";
import {
    listConversations,
    createConversation as apiCreateConversation,
    getConversation as apiGetConversation,
    updateConversation as apiUpdateConversation,
    addMessage as apiAddMessage,
    Conversation as ApiConversation,
    ConversationMessage as ApiMessage,
    ConversationWithMessages,
    MessageMetadata,
} from "@/lib/api";

export interface ConversationMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
    metadata?: MessageMetadata;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: ConversationMessage[];
}

// Convert API response to local format
function toLocalConversation(api: ApiConversation, messages: ApiMessage[] = []): Conversation {
    return {
        id: api.id,
        title: api.title,
        createdAt: api.created_at,
        updatedAt: api.updated_at,
        messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at,
            metadata: m.metadata,
        })),
    };
}

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load conversations from API on mount
    useEffect(() => {
        async function loadConversations() {
            try {
                setIsLoading(true);
                const apiConversations = await listConversations();
                const localConversations = apiConversations.map((c) => toLocalConversation(c));
                setConversations(localConversations);
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setIsLoaded(true);
                setIsLoading(false);
            }
        }
        loadConversations();
    }, []);

    const createConversation = useCallback(async (): Promise<string> => {
        try {
            const newConv = await apiCreateConversation("New Chat");
            const localConv = toLocalConversation(newConv);
            setConversations((prev) => [localConv, ...prev]);
            return newConv.id;
        } catch (error) {
            console.error("Failed to create conversation:", error);
            throw error;
        }
    }, []);

    const getConversation = useCallback(
        (id: string): Conversation | undefined => {
            return conversations.find((c) => c.id === id);
        },
        [conversations]
    );

    const fetchConversationMessages = useCallback(async (id: string): Promise<Conversation | undefined> => {
        try {
            const convWithMessages = await apiGetConversation(id);
            const localConv = toLocalConversation(convWithMessages, convWithMessages.messages);

            setConversations((prev) =>
                prev.map((c) => (c.id === id ? localConv : c))
            );

            return localConv;
        } catch (error) {
            // If conversation doesn't exist (404), this is expected for new chats
            // Don't log as error - just return undefined to allow chat to proceed
            return undefined;
        }
    }, []);

    const updateConversationMessages = useCallback(
        async (id: string, messages: ConversationMessage[]): Promise<void> => {
            // Update local state immediately for optimistic UI
            setConversations((prev) =>
                prev.map((conv) => {
                    if (conv.id !== id) return conv;

                    // Auto-generate title from first user message if still "New Chat"
                    let title = conv.title;
                    if (title === "New Chat" && messages.length > 0) {
                        const firstUserMessage = messages.find((m) => m.role === "user");
                        if (firstUserMessage) {
                            title = firstUserMessage.content.slice(0, 50) +
                                (firstUserMessage.content.length > 50 ? "..." : "");
                        }
                    }

                    return {
                        ...conv,
                        title,
                        messages,
                        updatedAt: new Date().toISOString(),
                    };
                })
            );

            // Update title in backend if changed
            const conv = conversations.find((c) => c.id === id);
            if (conv && conv.title === "New Chat" && messages.length > 0) {
                const firstUserMessage = messages.find((m) => m.role === "user");
                if (firstUserMessage) {
                    const newTitle = firstUserMessage.content.slice(0, 50) +
                        (firstUserMessage.content.length > 50 ? "..." : "");
                    try {
                        await apiUpdateConversation(id, newTitle);
                    } catch (error) {
                        console.error("Failed to update conversation title:", error);
                    }
                }
            }
        },
        [conversations]
    );

    const addMessageToConversation = useCallback(
        async (
            conversationId: string,
            role: "user" | "assistant",
            content: string,
            metadata?: MessageMetadata
        ): Promise<ConversationMessage | undefined> => {
            try {
                const apiMessage = await apiAddMessage(conversationId, role, content, metadata || {});
                const localMessage: ConversationMessage = {
                    id: apiMessage.id,
                    role: apiMessage.role,
                    content: apiMessage.content,
                    createdAt: apiMessage.created_at,
                    metadata: apiMessage.metadata,
                };

                setConversations((prev) =>
                    prev.map((conv) => {
                        if (conv.id !== conversationId) return conv;
                        return {
                            ...conv,
                            messages: [...conv.messages, localMessage],
                            updatedAt: new Date().toISOString(),
                        };
                    })
                );

                return localMessage;
            } catch (error) {
                console.error("Failed to add message:", error);
                return undefined;
            }
        },
        []
    );

    // Group conversations by date for sidebar display
    const groupedConversations = useCallback(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const groups: { label: string; conversations: Conversation[] }[] = [
            { label: "Today", conversations: [] },
            { label: "Yesterday", conversations: [] },
            { label: "Previous 7 Days", conversations: [] },
            { label: "Older", conversations: [] },
        ];

        conversations.forEach((conv) => {
            const convDate = new Date(conv.updatedAt);
            if (convDate >= today) {
                groups[0].conversations.push(conv);
            } else if (convDate >= yesterday) {
                groups[1].conversations.push(conv);
            } else if (convDate >= lastWeek) {
                groups[2].conversations.push(conv);
            } else {
                groups[3].conversations.push(conv);
            }
        });

        // Filter out empty groups
        return groups.filter((g) => g.conversations.length > 0);
    }, [conversations]);

    return {
        conversations,
        isLoaded,
        isLoading,
        createConversation,
        getConversation,
        fetchConversationMessages,
        updateConversationMessages,
        addMessageToConversation,
        groupedConversations,
    };
}
