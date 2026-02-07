"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useMemo, useEffect, use, useRef } from "react";
import { addMessage as apiAddMessage } from "@/lib/api";
import { Sparkles, Compass, Code, GraduationCap, CheckIcon, MicIcon, GlobeIcon, Twitter } from "lucide-react";
import {
    AgentSelector,
    AgentSelectorContent,
    AgentSelectorEmpty,
    AgentSelectorGroup,
    AgentSelectorInput,
    AgentSelectorItem,
    AgentSelectorList,
    AgentSelectorIcon,
    AgentSelectorName,
    AgentSelectorTrigger,
    AgentSelectorDescription,
    defaultAgents,
    type Agent,
} from "@/components/ai-elements/agent-selector";
import { useAgents } from "@/hooks/useAgents";
import {
    MessageBranch,
    MessageBranchContent,
    MessageBranchNext,
    MessageBranchPage,
    MessageBranchPrevious,
    MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    PromptInput,
    PromptInputActionAddAttachments,
    PromptInputActionMenu,
    PromptInputActionMenuContent,
    PromptInputActionMenuTrigger,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputButton,
    PromptInputFooter,
    PromptInputHeader,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
    ModelSelector,
    ModelSelectorContent,
    ModelSelectorEmpty,
    ModelSelectorGroup,
    ModelSelectorInput,
    ModelSelectorItem,
    ModelSelectorList,
    ModelSelectorLogo,
    ModelSelectorLogoGroup,
    ModelSelectorName,
    ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { MessageResponse } from "@/components/ai-elements/message";
import { toast } from "sonner";
import { useConversationsContext } from "@/contexts/conversations-context";
import { useProductContext } from "@/hooks/useProductContext";

const CATEGORIES = [
    { label: "Thread", icon: Twitter, agentHint: "twitter" },
    { label: "Create", icon: Sparkles, agentHint: "auto" },
    { label: "Explore", icon: Compass, agentHint: "auto" },
    { label: "Learn", icon: GraduationCap, agentHint: "auto" },
];

const SUGGESTIONS = [
    "Write a Twitter thread about my product launch",
    "Create build-in-public content for this week",
    "Write a viral tweet about indie hacking",
    "Generate a launch announcement thread",
];

const models = [
    {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
    },
    {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
    },
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        chef: "Google",
        chefSlug: "google",
        providers: ["google"],
    },
    {
        id: "gpt-4o",
        name: "GPT-4o",
        chef: "OpenAI",
        chefSlug: "openai",
        providers: ["openai", "azure"],
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        chef: "OpenAI",
        chefSlug: "openai",
        providers: ["openai", "azure"],
    },
    {
        id: "claude-opus-4-20250514",
        name: "Claude 4 Opus",
        chef: "Anthropic",
        chefSlug: "anthropic",
        providers: ["anthropic", "azure", "google", "amazon-bedrock"],
    },
    {
        id: "claude-sonnet-4-20250514",
        name: "Claude 4 Sonnet",
        chef: "Anthropic",
        chefSlug: "anthropic",
        providers: ["anthropic", "azure", "google", "amazon-bedrock"],
    },
];

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
    const { chatId } = use(params);
    const [input, setInput] = useState("");
    const [model, setModel] = useState<string>(models[0].id);
    const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
    const [useMicrophone, setUseMicrophone] = useState<boolean>(false);

    // Agent selection ("auto" = let coordinator decide, "twitter" = specific agent)
    const [selectedAgent, setSelectedAgent] = useState<string>("auto");
    const [agentSelectorOpen, setAgentSelectorOpen] = useState(false);
    const { agents } = useAgents();

    // Find selected agent data
    const selectedAgentData = agents.find((a) => a.id === selectedAgent) || agents[0];

    // Product context for personalized responses
    const { getProductContextForChat } = useProductContext();
    const productContext = getProductContextForChat();

    const { getConversation, fetchConversationMessages, updateConversationMessages, isLoaded } = useConversationsContext();

    // Track which messages have been saved to Supabase
    const savedMessageIds = useRef<Set<string>>(new Set());
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    // Dynamic padding for conversation content based on input box height
    const inputBoxRef = useRef<HTMLDivElement>(null);
    const [inputBoxHeight, setInputBoxHeight] = useState(120); // Default fallback

    // Load existing conversation
    const existingConversation = isLoaded ? getConversation(chatId) : undefined;

    // Use the useChat hook to connect to the backend
    const { messages, sendMessage, status, setMessages } = useChat({
        id: chatId, // Use chatId to persist messages for this specific chat
        transport: new DefaultChatTransport({
            api: "http://127.0.0.1:8000/api/chat",
            body: {
                model,
                agent_id: selectedAgent === "auto" ? null : selectedAgent,
                product_context: productContext,
            },
        }),
    });

    // Fetch messages from Supabase on mount
    useEffect(() => {
        async function loadMessages() {
            if (!isLoaded) return;

            try {
                const conv = await fetchConversationMessages(chatId);
                if (conv && conv.messages.length > 0) {
                    // Mark all fetched messages as already saved
                    conv.messages.forEach((msg) => savedMessageIds.current.add(msg.id));

                    // Convert stored messages to useChat format
                    const restoredMessages = conv.messages.map((msg) => ({
                        id: msg.id,
                        role: msg.role as "user" | "assistant",
                        parts: [{ type: "text" as const, text: msg.content }],
                        createdAt: new Date(msg.createdAt),
                    }));
                    setMessages(restoredMessages);
                }
            } catch (error) {
                console.error("Failed to load messages:", error);
            } finally {
                setIsLoadingMessages(false);
            }
        }
        loadMessages();
    }, [chatId, isLoaded, fetchConversationMessages, setMessages]);

    // Track previous status to detect when streaming ends
    const prevStatus = useRef(status);

    // Save new messages to Supabase when streaming completes (status goes from streaming to ready or error)
    useEffect(() => {
        const wasStreaming = prevStatus.current === "streaming";
        const streamEnded = status === "ready" || status === "error";
        prevStatus.current = status;

        async function saveMessages() {
            if (messages.length === 0) return;

            // Find messages that haven't been saved yet
            const unsavedMessages = messages.filter((msg) => !savedMessageIds.current.has(msg.id));

            if (unsavedMessages.length === 0) return;

            // Save each unsaved message sequentially
            for (const msg of unsavedMessages) {
                const content = msg.parts
                    .filter((part): part is { type: "text"; text: string } => part.type === "text")
                    .map((part) => part.text)
                    .join("");

                try {
                    await apiAddMessage(chatId, msg.role as "user" | "assistant", content, {});
                    savedMessageIds.current.add(msg.id);
                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }

            // Update local state for sidebar title
            const storedMessages = messages.map((msg) => ({
                id: msg.id,
                role: msg.role as "user" | "assistant",
                content: msg.parts
                    .filter((part): part is { type: "text"; text: string } => part.type === "text")
                    .map((part) => part.text)
                    .join(""),
                createdAt: new Date().toISOString(),
            }));
            updateConversationMessages(chatId, storedMessages);
        }

        // Save when streaming just finished (to ready OR error state)
        if (wasStreaming && streamEnded) {
            saveMessages();
        }
    }, [messages, status, chatId, updateConversationMessages]);

    const selectedModelData = models.find((m) => m.id === model);
    const hasMessages = messages.length > 0;
    const isStreaming = status === "streaming";

    // Measure input box height dynamically
    useEffect(() => {
        const inputBox = inputBoxRef.current;
        if (!inputBox) return;

        const updateHeight = () => {
            setInputBoxHeight(inputBox.offsetHeight);
        };

        // Initial measurement
        updateHeight();

        // Use ResizeObserver to track size changes
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(inputBox);

        return () => resizeObserver.disconnect();
    }, []);

    // Map useChat messages to our display format
    const displayMessages = useMemo(() => {
        return messages.map((msg) => {
            // Extract text content from parts
            const textContent = msg.parts
                .filter((part): part is { type: "text"; text: string } => part.type === "text")
                .map((part) => part.text)
                .join("");

            return {
                key: msg.id,
                from: msg.role as "user" | "assistant",
                versions: [
                    {
                        id: msg.id,
                        content: textContent,
                    },
                ],
            };
        });
    }, [messages]);

    const handleSubmit = (message: PromptInputMessage) => {
        const hasText = Boolean(message.text);
        const hasAttachments = Boolean(message.files?.length);

        if (!(hasText || hasAttachments)) {
            return;
        }

        if (message.files?.length) {
            toast.success("Files attached", {
                description: `${message.files.length} file(s) attached to message`,
            });
        }

        // Use sendMessage to send the message to the backend
        if (message.text) {
            sendMessage({ text: message.text });
        }
        setInput("");
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage({ text: suggestion });
    };

    // Map useChat status to our status type
    const displayStatus = status === "streaming" ? "streaming" : status === "submitted" ? "submitted" : "ready";

    // Show loading state while conversations are loading
    if (!isLoaded) {
        return (
            <main
                className="flex flex-col justify-center items-center h-full"
                style={{ backgroundColor: "rgb(15, 15, 16)" }}
            >
                <div className="text-white/60">Loading...</div>
            </main>
        );
    }

    return (
        <main
            className="flex flex-col justify-end items-center h-full pb-4"
            style={{
                backgroundColor: "rgb(15, 15, 16)"
            }}
        >
            {/* Content Area */}
            <div className="flex-1 w-full max-w-2xl overflow-y-auto px-4">
                {!hasMessages ? (
                    /* Welcome Section - shown when no messages */
                    <div className="flex flex-col justify-center h-full pb-4">
                        <div className="max-w-xl w-full mb-8">
                            {/* Heading */}
                            <h1
                                className="text-3xl font-semibold text-white/90 text-start mb-6 font-black font-[950]"
                                style={{ fontWeight: 900 }}
                            >
                                How can I help you?
                            </h1>

                            {/* Category Buttons */}
                            <div className="flex flex-wrap justify-start gap-3 mb-8">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.label}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-all font-black"
                                    >
                                        <cat.icon className="w-4 h-4" />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Suggestion Questions */}
                            <div className="space-y-0">
                                {SUGGESTIONS.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(question)}
                                        className="w-full text-left py-3 px-2 text-white/60 text-[15px] hover:text-white transition-colors border-t border-white/5 first:border-t-0"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <Conversation>
                        <ConversationContent style={{ paddingBottom: inputBoxHeight + 16 }}>
                            {displayMessages.map(({ versions, ...message }) => (
                                <MessageBranch defaultBranch={0} key={message.key}>
                                    <MessageBranchContent>
                                        {versions.map((version) => (
                                            <Message
                                                from={message.from}
                                                key={`${message.key}-${version.id}`}
                                            >
                                                <div>
                                                    <MessageContent >
                                                        <MessageResponse>{version.content}</MessageResponse>
                                                    </MessageContent>
                                                </div>
                                            </Message>
                                        ))}
                                    </MessageBranchContent>
                                    {versions.length > 1 && (
                                        <MessageBranchSelector from={message.from}>
                                            <MessageBranchPrevious />
                                            <MessageBranchPage />
                                            <MessageBranchNext />
                                        </MessageBranchSelector>
                                    )}
                                </MessageBranch>
                            ))}
                        </ConversationContent>
                        <ConversationScrollButton />
                    </Conversation>
                )}
            </div>

            {/* Chat Input */}
            <div ref={inputBoxRef} className="grid shrink-0 gap-4 pt-4 w-[60%] fixed bottom-0 bg-[rgb(15,15,16)]">
                <div className="w-full px-4 pb-4">
                    <PromptInput globalDrop multiple onSubmit={handleSubmit} className="rounded-2xl bg-[var(--background)]">
                        <PromptInputHeader>
                            <PromptInputAttachments>
                                {(attachment) => <PromptInputAttachment data={attachment} />}
                            </PromptInputAttachments>
                        </PromptInputHeader>
                        <PromptInputBody>
                            <PromptInputTextarea
                                onChange={(event) => setInput(event.target.value)}
                                value={input}
                            />
                        </PromptInputBody>
                        <PromptInputFooter>
                            <PromptInputTools>
                                <PromptInputActionMenu>
                                    <PromptInputActionMenuTrigger />
                                    <PromptInputActionMenuContent>
                                        <PromptInputActionAddAttachments />
                                    </PromptInputActionMenuContent>
                                </PromptInputActionMenu>
                                <AgentSelector
                                    onOpenChange={setAgentSelectorOpen}
                                    open={agentSelectorOpen}
                                >
                                    <AgentSelectorTrigger asChild>
                                        <PromptInputButton>
                                            <AgentSelectorIcon icon={selectedAgentData?.icon || "✨"} />
                                            <AgentSelectorName>
                                                {selectedAgentData?.name || "Auto"}
                                            </AgentSelectorName>
                                        </PromptInputButton>
                                    </AgentSelectorTrigger>
                                    <AgentSelectorContent>
                                        <AgentSelectorInput placeholder="Search agents..." />
                                        <AgentSelectorList>
                                            <AgentSelectorEmpty>No agents found.</AgentSelectorEmpty>
                                            <AgentSelectorGroup heading="Marketing Agents">
                                                {agents.map((agent) => (
                                                    <AgentSelectorItem
                                                        key={agent.id}
                                                        onSelect={() => {
                                                            setSelectedAgent(agent.id);
                                                            setAgentSelectorOpen(false);
                                                        }}
                                                        value={agent.id}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <AgentSelectorIcon icon={agent.icon} />
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <AgentSelectorName>{agent.name}</AgentSelectorName>
                                                            <AgentSelectorDescription>
                                                                {agent.description}
                                                            </AgentSelectorDescription>
                                                        </div>
                                                        {selectedAgent === agent.id && (
                                                            <CheckIcon className="size-4 ml-auto" />
                                                        )}
                                                    </AgentSelectorItem>
                                                ))}
                                            </AgentSelectorGroup>
                                        </AgentSelectorList>
                                    </AgentSelectorContent>
                                </AgentSelector>
                                <PromptInputButton
                                    onClick={() => setUseMicrophone(!useMicrophone)}
                                    variant={useMicrophone ? "default" : "ghost"}
                                >
                                    <MicIcon size={16} />
                                    <span className="sr-only">Microphone</span>
                                </PromptInputButton>
                                <PromptInputButton
                                    onClick={() => setUseWebSearch(!useWebSearch)}
                                    variant={useWebSearch ? "default" : "ghost"}
                                >
                                    <GlobeIcon size={16} />
                                    <span>Search</span>
                                </PromptInputButton>
                                <ModelSelector
                                    onOpenChange={setModelSelectorOpen}
                                    open={modelSelectorOpen}
                                >
                                    <ModelSelectorTrigger asChild>
                                        <PromptInputButton>
                                            {selectedModelData?.chefSlug && (
                                                <ModelSelectorLogo provider={selectedModelData.chefSlug} />
                                            )}
                                            {selectedModelData?.name && (
                                                <ModelSelectorName>
                                                    {selectedModelData.name}
                                                </ModelSelectorName>
                                            )}
                                        </PromptInputButton>
                                    </ModelSelectorTrigger>
                                    <ModelSelectorContent>
                                        <ModelSelectorInput placeholder="Search models..." />
                                        <ModelSelectorList>
                                            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                                            {["OpenAI", "Anthropic", "Google"].map((chef) => (
                                                <ModelSelectorGroup key={chef} heading={chef}>
                                                    {models
                                                        .filter((m) => m.chef === chef)
                                                        .map((m) => (
                                                            <ModelSelectorItem
                                                                key={m.id}
                                                                onSelect={() => {
                                                                    setModel(m.id);
                                                                    setModelSelectorOpen(false);
                                                                }}
                                                                value={m.id}
                                                            >
                                                                <ModelSelectorLogo provider={m.chefSlug} />
                                                                <ModelSelectorName>{m.name}</ModelSelectorName>
                                                                <ModelSelectorLogoGroup>
                                                                    {m.providers.map((provider) => (
                                                                        <ModelSelectorLogo
                                                                            key={provider}
                                                                            provider={provider}
                                                                        />
                                                                    ))}
                                                                </ModelSelectorLogoGroup>
                                                                {model === m.id ? (
                                                                    <CheckIcon className="ml-auto size-4" />
                                                                ) : (
                                                                    <div className="ml-auto size-4" />
                                                                )}
                                                            </ModelSelectorItem>
                                                        ))}
                                                </ModelSelectorGroup>
                                            ))}
                                        </ModelSelectorList>
                                    </ModelSelectorContent>
                                </ModelSelector>
                            </PromptInputTools>
                            <PromptInputSubmit
                                disabled={!input.trim() || isStreaming}
                                status={displayStatus}
                            />
                        </PromptInputFooter>
                    </PromptInput>
                </div>
            </div>
        </main >
    );
}
