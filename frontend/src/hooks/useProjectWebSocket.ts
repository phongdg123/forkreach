"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ProjectWebSocket, WebSocketMessage } from "@/lib/api";

interface ChatMessage {
    id: string;
    sender: "ai" | "user";
    content: string;
    isStreaming?: boolean;
}

interface UseProjectWebSocketResult {
    messages: ChatMessage[];
    isConnected: boolean;
    isAiTyping: boolean;
    streamingContent: string;
    sendMessage: (message: string) => void;
    connect: () => void;
    disconnect: () => void;
}

export function useProjectWebSocket(
    projectId: string | null,
    initialPrompt?: string
): UseProjectWebSocketResult {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const wsRef = useRef<ProjectWebSocket | null>(null);
    const messageIdCounter = useRef(0);

    // Generate unique message ID
    const generateMessageId = useCallback(() => {
        messageIdCounter.current++;
        return `msg-${Date.now()}-${messageIdCounter.current}`;
    }, []);

    // Handle incoming WebSocket messages
    const handleMessage = useCallback((message: WebSocketMessage) => {
        switch (message.type) {
            case "connected":
                setIsConnected(true);
                // Add initial AI message based on prompt
                if (initialPrompt) {
                    setMessages([{
                        id: generateMessageId(),
                        sender: "ai",
                        content: `I've received your design request: "${initialPrompt}"\n\nI'm ready to help you refine this design. What would you like to change or add?`
                    }]);
                }
                break;

            case "message_received":
                // User message was acknowledged - already added locally
                break;

            case "ai_start":
                setIsAiTyping(true);
                setStreamingContent("");
                break;

            case "ai_stream":
                setStreamingContent(message.full_content || "");
                break;

            case "ai_complete":
                setIsAiTyping(false);
                setMessages(prev => [
                    ...prev,
                    {
                        id: generateMessageId(),
                        sender: "ai",
                        content: message.content || ""
                    }
                ]);
                setStreamingContent("");
                break;
        }
    }, [initialPrompt, generateMessageId]);

    // Handle WebSocket errors
    const handleError = useCallback(() => {
        setIsConnected(false);
    }, []);

    // Handle WebSocket close
    const handleClose = useCallback(() => {
        setIsConnected(false);
    }, []);

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (!projectId || wsRef.current?.isConnected()) return;

        wsRef.current = new ProjectWebSocket(
            projectId,
            handleMessage,
            handleError,
            handleClose
        );
        wsRef.current.connect();
    }, [projectId, handleMessage, handleError, handleClose]);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        wsRef.current?.disconnect();
        wsRef.current = null;
        setIsConnected(false);
    }, []);

    // Send a chat message
    const sendMessage = useCallback((content: string) => {
        if (!content.trim() || !wsRef.current?.isConnected()) return;

        // Add user message to local state immediately
        setMessages(prev => [
            ...prev,
            {
                id: generateMessageId(),
                sender: "user",
                content: content.trim()
            }
        ]);

        // Send via WebSocket
        wsRef.current.sendMessage(content.trim());
    }, [generateMessageId]);

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        if (projectId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [projectId, connect, disconnect]);

    return {
        messages,
        isConnected,
        isAiTyping,
        streamingContent,
        sendMessage,
        connect,
        disconnect
    };
}
