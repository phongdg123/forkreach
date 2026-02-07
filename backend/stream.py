"""
Streaming chat endpoint compatible with ai-sdk UI Message Stream Protocol v1.

Now supports:
- Multiple AI agents via Coordinator
- Product context for personalized responses
- Auto-routing based on user intent
"""
import json
import os
import uuid
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# Import agent system
from agents import Coordinator, ProductContext

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

router = APIRouter()

# Supported models - Gemini models are functional, others require API keys
SUPPORTED_MODELS = {
    # Google Gemini models (functional with GEMINI_API_KEY)
    "gemini-2.5-flash": "gemini-2.5-flash",
    "gemini-2.0-flash-exp": "gemini-2.0-flash-exp",
    "gemini-1.5-pro": "gemini-1.5-pro",
    "gemini-1.5-flash": "gemini-1.5-flash",
    # OpenAI models (require OPENAI_API_KEY - not yet implemented)
    "gpt-4o": None,
    "gpt-4o-mini": None,
    # Anthropic models (require ANTHROPIC_API_KEY - not yet implemented)
    "claude-opus-4-20250514": None,
    "claude-sonnet-4-20250514": None,
}

DEFAULT_MODEL = "gemini-2.5-flash"

# Initialize coordinator with agents
coordinator = Coordinator(model_name=DEFAULT_MODEL)


class MessagePart(BaseModel):
    type: str
    text: Optional[str] = None


class Message(BaseModel):
    role: str
    parts: List[MessagePart]


class ProductContextRequest(BaseModel):
    """Product/brand context from frontend."""
    name: str
    tagline: Optional[str] = None
    target_audience: Optional[str] = None
    key_features: Optional[List[str]] = None
    brand_voice: str = "casual"


class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = DEFAULT_MODEL
    agent_id: Optional[str] = None  # "twitter", "launch", etc. None = auto-route
    product_context: Optional[ProductContextRequest] = None


async def stream_agent_response(
    user_message: str, 
    model_name: str = DEFAULT_MODEL,
    agent_id: Optional[str] = None,
    product_context: Optional[ProductContextRequest] = None,
    conversation_history: Optional[List[dict]] = None
):
    """Stream agent response in ai-sdk UI Message Stream Protocol v1 format (SSE)."""
    
    message_id = f"msg_{uuid.uuid4().hex}"
    text_id = f"text_{uuid.uuid4().hex}"
    
    try:
        # Check if model is supported
        gemini_model_name = SUPPORTED_MODELS.get(model_name)
        
        if gemini_model_name is None:
            # Model not yet supported (OpenAI/Anthropic)
            error_text = f"Model '{model_name}' is not yet supported. Please use a Gemini model."
            yield f"data: {json.dumps({'type': 'start', 'messageId': message_id})}\n\n"
            yield f"data: {json.dumps({'type': 'text-start', 'id': text_id})}\n\n"
            yield f"data: {json.dumps({'type': 'text-delta', 'id': text_id, 'delta': error_text})}\n\n"
            yield f"data: {json.dumps({'type': 'text-end', 'id': text_id})}\n\n"
            yield f"data: {json.dumps({'type': 'finish', 'messageId': message_id, 'finishReason': 'error'})}\n\n"
            return
        
        # Convert product context if provided
        product_ctx = None
        if product_context:
            product_ctx = ProductContext(
                name=product_context.name,
                tagline=product_context.tagline,
                target_audience=product_context.target_audience,
                key_features=product_context.key_features,
                brand_voice=product_context.brand_voice
            )
        
        # Start event
        yield f"data: {json.dumps({'type': 'start', 'messageId': message_id})}\n\n"
        
        # Text start
        yield f"data: {json.dumps({'type': 'text-start', 'id': text_id})}\n\n"
        
        # Route through coordinator and stream response
        async for chunk in coordinator.route_and_generate(
            user_message=user_message,
            agent_id=agent_id,
            product_context=product_ctx,
            conversation_history=conversation_history
        ):
            # Check if this is the agent identifier (skip it from text output)
            if chunk.startswith("[AGENT:") and chunk.endswith("]"):
                # Could emit agent info as metadata if needed
                continue
            
            text_delta_event = {
                "type": "text-delta",
                "id": text_id,
                "delta": chunk
            }
            yield f"data: {json.dumps(text_delta_event)}\n\n"
        
        # Text end
        yield f"data: {json.dumps({'type': 'text-end', 'id': text_id})}\n\n"
        
        # Finish message
        yield f"data: {json.dumps({'type': 'finish', 'messageId': message_id, 'finishReason': 'stop'})}\n\n"
        
    except Exception as e:
        # Handle errors gracefully
        error_text = f"Error generating response: {str(e)}"
        yield f"data: {json.dumps({'type': 'start', 'messageId': message_id})}\n\n"
        yield f"data: {json.dumps({'type': 'text-start', 'id': text_id})}\n\n"
        yield f"data: {json.dumps({'type': 'text-delta', 'id': text_id, 'delta': error_text})}\n\n"
        yield f"data: {json.dumps({'type': 'text-end', 'id': text_id})}\n\n"
        yield f"data: {json.dumps({'type': 'finish', 'messageId': message_id, 'finishReason': 'error'})}\n\n"


@router.post("/api/chat")
async def chat_stream(request: ChatRequest):
    """Handle chat requests and stream responses via agent coordinator."""
    # Extract the last user message
    user_message = ""
    conversation_history = []
    
    for msg in request.messages:
        content = ""
        for part in msg.parts:
            if part.type == "text" and part.text:
                content = part.text
                break
        if content:
            conversation_history.append({
                "role": msg.role,
                "content": content
            })
    
    # Get the last user message
    for msg in reversed(request.messages):
        if msg.role == "user" and msg.parts:
            for part in msg.parts:
                if part.type == "text" and part.text:
                    user_message = part.text
                    break
            if user_message:
                break
    
    # Get model from request
    model_name = request.model if request.model else DEFAULT_MODEL
    
    return StreamingResponse(
        stream_agent_response(
            user_message=user_message, 
            model_name=model_name,
            agent_id=request.agent_id,
            product_context=request.product_context,
            conversation_history=conversation_history[:-1]  # Exclude last (current) message
        ),
        media_type="text/event-stream",
        headers={
            "x-vercel-ai-ui-message-stream": "v1",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/api/agents")
async def get_agents():
    """Return list of available agents."""
    agents = coordinator.get_available_agents()
    return {
        "agents": [
            {
                "id": agent.id,
                "name": agent.name,
                "icon": agent.icon,
                "description": agent.description,
                "capabilities": agent.capabilities
            }
            for agent in agents
        ]
    }
