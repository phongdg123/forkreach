"""
Conversations API endpoints for CRUD operations.
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from supabase_client import supabase

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


# Pydantic Models
class MessageMetadata(BaseModel):
    model: Optional[str] = None
    tokens: Optional[Dict[str, int]] = None
    attachments: Optional[List[Dict[str, Any]]] = None


class MessageCreate(BaseModel):
    role: str
    content: str
    metadata: Optional[MessageMetadata] = None


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    metadata: Dict[str, Any]
    created_at: str


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"


class ConversationUpdate(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: str
    title: str
    device_id: str
    created_at: str
    updated_at: str


class ConversationWithMessages(ConversationResponse):
    messages: List[MessageResponse]


def get_device_id(x_device_id: Optional[str] = Header(None)) -> str:
    """Extract device ID from header or generate a new one."""
    if x_device_id:
        return x_device_id
    return str(uuid.uuid4())


@router.get("", response_model=List[ConversationResponse])
async def list_conversations(x_device_id: str = Header(...)):
    """List all conversations for a device."""
    try:
        result = supabase.table("conversations") \
            .select("*") \
            .eq("device_id", x_device_id) \
            .order("updated_at", desc=True) \
            .execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=ConversationResponse)
async def create_conversation(
    conversation: ConversationCreate,
    x_device_id: str = Header(...)
):
    """Create a new conversation."""
    try:
        data = {
            "title": conversation.title,
            "device_id": x_device_id,
        }
        result = supabase.table("conversations").insert(data).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{conversation_id}", response_model=ConversationWithMessages)
async def get_conversation(conversation_id: str, x_device_id: str = Header(...)):
    """Get a conversation with all its messages."""
    try:
        # Get conversation
        conv_result = supabase.table("conversations") \
            .select("*") \
            .eq("id", conversation_id) \
            .eq("device_id", x_device_id) \
            .single() \
            .execute()
        
        if not conv_result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages
        msg_result = supabase.table("messages") \
            .select("*") \
            .eq("conversation_id", conversation_id) \
            .order("created_at", desc=False) \
            .execute()
        
        return {**conv_result.data, "messages": msg_result.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: str,
    update: ConversationUpdate,
    x_device_id: str = Header(...)
):
    """Update a conversation's title."""
    try:
        result = supabase.table("conversations") \
            .update({"title": update.title, "updated_at": datetime.utcnow().isoformat()}) \
            .eq("id", conversation_id) \
            .eq("device_id", x_device_id) \
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, x_device_id: str = Header(...)):
    """Delete a conversation and all its messages."""
    try:
        result = supabase.table("conversations") \
            .delete() \
            .eq("id", conversation_id) \
            .eq("device_id", x_device_id) \
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def add_message(
    conversation_id: str,
    message: MessageCreate,
    x_device_id: str = Header(...)
):
    """Add a message to a conversation."""
    try:
        # Verify conversation exists and belongs to device
        conv_result = supabase.table("conversations") \
            .select("id") \
            .eq("id", conversation_id) \
            .eq("device_id", x_device_id) \
            .single() \
            .execute()
        
        if not conv_result.data:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Create message
        data = {
            "conversation_id": conversation_id,
            "role": message.role,
            "content": message.content,
            "metadata": message.metadata.model_dump() if message.metadata else {},
        }
        result = supabase.table("messages").insert(data).execute()
        
        # Update conversation's updated_at
        supabase.table("conversations") \
            .update({"updated_at": datetime.utcnow().isoformat()}) \
            .eq("id", conversation_id) \
            .execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
