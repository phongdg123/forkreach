"""
Base Agent class for all marketing agents.

All agents inherit from this class and implement their own
system prompts and specialized behavior.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, AsyncGenerator, List
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


@dataclass
class ProductContext:
    """Product/brand context that agents use to personalize responses."""
    name: str
    tagline: Optional[str] = None
    target_audience: Optional[str] = None
    key_features: Optional[List[str]] = None
    brand_voice: str = "casual"  # casual, professional, playful
    
    def to_prompt_context(self) -> str:
        """Convert product context to a string for system prompts."""
        parts = [f"Product Name: {self.name}"]
        
        if self.tagline:
            parts.append(f"Tagline: {self.tagline}")
        if self.target_audience:
            parts.append(f"Target Audience: {self.target_audience}")
        if self.key_features:
            parts.append(f"Key Features: {', '.join(self.key_features)}")
        if self.brand_voice:
            parts.append(f"Brand Voice: {self.brand_voice}")
            
        return "\n".join(parts)


@dataclass
class AgentInfo:
    """Metadata about an agent for UI display."""
    id: str
    name: str
    icon: str  # emoji or icon name
    description: str
    capabilities: List[str]


class BaseAgent(ABC):
    """
    Abstract base class for all marketing agents.
    
    Each agent has:
    - A unique ID and metadata for UI
    - A system prompt defining its personality and expertise
    - Methods for generating streaming responses
    """
    
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name
        self.model = genai.GenerativeModel(model_name)
        self._product_context: Optional[ProductContext] = None
    
    @property
    @abstractmethod
    def agent_info(self) -> AgentInfo:
        """Return agent metadata for UI display."""
        pass
    
    @property
    @abstractmethod
    def base_system_prompt(self) -> str:
        """Return the base system prompt for this agent."""
        pass
    
    def set_product_context(self, context: ProductContext) -> None:
        """Set the product context for personalized responses."""
        self._product_context = context
    
    def get_system_prompt(self) -> str:
        """
        Build the full system prompt, including product context if available.
        """
        prompt = self.base_system_prompt
        
        if self._product_context:
            prompt += f"\n\n## Product Context\n{self._product_context.to_prompt_context()}"
        
        return prompt
    
    async def generate_response(
        self, 
        user_message: str,
        conversation_history: Optional[List[dict]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Generate a streaming response from the agent.
        
        Args:
            user_message: The user's input message
            conversation_history: Previous messages for context
            
        Yields:
            Text chunks as they stream from the model
        """
        # Build the full prompt with system context
        system_prompt = self.get_system_prompt()
        
        # Format the prompt for Gemini
        full_prompt = f"{system_prompt}\n\n---\n\nUser: {user_message}"
        
        # If we have conversation history, include it
        if conversation_history:
            history_text = "\n".join([
                f"{msg['role'].capitalize()}: {msg['content']}"
                for msg in conversation_history[-5:]  # Last 5 messages for context
            ])
            full_prompt = f"{system_prompt}\n\n## Conversation History\n{history_text}\n\n---\n\nUser: {user_message}"
        
        try:
            response = await self.model.generate_content_async(full_prompt, stream=True)
            
            async for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            yield f"Error generating response: {str(e)}"
    
    def can_handle(self, user_message: str) -> float:
        """
        Return a confidence score (0-1) for whether this agent can handle the message.
        
        Used by the coordinator for auto-routing.
        Default implementation returns 0.5 (neutral). Override in subclasses.
        """
        return 0.5
