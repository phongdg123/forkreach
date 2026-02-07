const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export interface DesignRequest {
    prompt: string;
    design_type: "App" | "Web";
}

export interface UpdateProjectRequest {
    title?: string;
    prompt?: string;
    design_type?: "App" | "Web";
    status?: string;
}

export interface ProjectResponse {
    id: string;
    prompt: string;
    design_type: string;
    status: string;
    created_at: string;
    title?: string;
}

export interface WebSocketMessage {
    type: "connected" | "message_received" | "ai_start" | "ai_stream" | "ai_complete";
    project_id?: string;
    message?: string;
    content?: string;
    full_content?: string;
    sender?: string;
}

export async function createDesign(request: DesignRequest): Promise<ProjectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/designs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Failed to create design");
    }

    return response.json();
}

export async function getDesign(projectId: string): Promise<ProjectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/designs/${projectId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch design");
    }

    return response.json();
}

export async function listDesigns(): Promise<{ projects: ProjectResponse[] }> {
    const response = await fetch(`${API_BASE_URL}/api/designs`);

    if (!response.ok) {
        throw new Error("Failed to fetch designs");
    }

    return response.json();
}

export async function updateDesign(
    projectId: string,
    request: UpdateProjectRequest
): Promise<ProjectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/designs/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error("Failed to update design");
    }

    return response.json();
}

export async function deleteDesign(projectId: string): Promise<{ message: string; id: string }> {
    const response = await fetch(`${API_BASE_URL}/api/designs/${projectId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete design");
    }

    return response.json();
}

export async function healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
        throw new Error("API health check failed");
    }

    return response.json();
}

// WebSocket connection class
export class ProjectWebSocket {
    private ws: WebSocket | null = null;
    private projectId: string;
    private onMessage: (message: WebSocketMessage) => void;
    private onError: (error: Event) => void;
    private onClose: () => void;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    constructor(
        projectId: string,
        onMessage: (message: WebSocketMessage) => void,
        onError?: (error: Event) => void,
        onClose?: () => void
    ) {
        this.projectId = projectId;
        this.onMessage = onMessage;
        this.onError = onError || (() => { });
        this.onClose = onClose || (() => { });
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        this.ws = new WebSocket(`${WS_BASE_URL}/ws/${this.projectId}`);

        this.ws.onopen = () => {
            console.log("WebSocket connected");
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WebSocketMessage;
                this.onMessage(message);
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error);
            }
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.onError(error);
        };

        this.ws.onclose = () => {
            console.log("WebSocket closed");
            this.onClose();

            // Attempt to reconnect
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
            }
        };
    }

    sendMessage(message: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: "chat",
                message: message
            }));
        } else {
            console.error("WebSocket is not connected");
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

// ============================================
// Conversations API
// ============================================

export interface MessageMetadata {
    model?: string;
    tokens?: { prompt?: number; completion?: number };
    attachments?: { name: string; type: string; size: number }[];
}

export interface ConversationMessage {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
    metadata: MessageMetadata;
    created_at: string;
}

export interface Conversation {
    id: string;
    title: string;
    device_id: string;
    created_at: string;
    updated_at: string;
}

export interface ConversationWithMessages extends Conversation {
    messages: ConversationMessage[];
}

function getDeviceId(): string {
    if (typeof window === "undefined") return "";

    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("device_id", deviceId);
    }
    return deviceId;
}

export async function listConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return response.json();
}

export async function createConversation(title: string = "New Chat"): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/api/conversations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-device-id": getDeviceId(),
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error("Failed to create conversation");
    }

    return response.json();
}

export async function getConversation(conversationId: string): Promise<ConversationWithMessages> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch conversation");
    }

    return response.json();
}

export async function updateConversation(conversationId: string, title: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-device-id": getDeviceId(),
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error("Failed to update conversation");
    }

    return response.json();
}

export async function deleteConversation(conversationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete conversation");
    }

    return response.json();
}

export async function addMessage(
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    metadata: MessageMetadata = {}
): Promise<ConversationMessage> {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-device-id": getDeviceId(),
        },
        body: JSON.stringify({ role, content, metadata }),
    });

    if (!response.ok) {
        throw new Error("Failed to add message");
    }

    return response.json();
}

// ============================================
// Product Context API
// ============================================

export interface ProductCreate {
    name: string;
    tagline?: string;
    target_audience?: string;
    key_features?: string[];
    brand_voice?: "casual" | "professional" | "playful";
}

export interface Product {
    id: string;
    device_id: string;
    name: string;
    tagline: string | null;
    target_audience: string | null;
    key_features: string[];
    brand_voice: string;
    created_at: string;
    updated_at: string;
}

export async function listProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products;
}

export async function getProduct(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    return response.json();
}

export async function createProduct(product: ProductCreate): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-device-id": getDeviceId(),
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error("Failed to create product");
    }

    const data = await response.json();
    return data.product;
}

export async function deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
            "x-device-id": getDeviceId(),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
}
