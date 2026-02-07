"""
Coordinator Agent for routing requests to specialized agents.

Handles:
- Direct routing when user selects an agent
- Auto-routing based on intent detection
- Combining product context with agent selection
"""

from typing import Optional, Dict, AsyncGenerator, List
from .base_agent import BaseAgent, ProductContext, AgentInfo
from .twitter_agent import TwitterAgent
from .launch_strategist_agent import LaunchStrategistAgent
from .landing_page_agent import LandingPageAgent
from .email_marketing_agent import EmailMarketingAgent


class Coordinator:
    """
    Routes user requests to the appropriate specialized agent.
    
    Supports two modes:
    1. Direct routing: User explicitly selects an agent
    2. Auto routing: Coordinator analyzes intent and picks best agent
    """
    
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name
        self.agents: Dict[str, BaseAgent] = {}
        self._register_agents()
        
    def _register_agents(self) -> None:
        """Register all available agents."""
        # Twitter/X agent (priority agent for indie hackers)
        self.agents["twitter"] = TwitterAgent(model_name=self.model_name)
        
        # Launch strategist for Product Hunt, HN, etc.
        self.agents["launch"] = LaunchStrategistAgent(model_name=self.model_name)
        
        # Landing page copy specialist
        self.agents["landing"] = LandingPageAgent(model_name=self.model_name)
        
        # Email marketing specialist
        self.agents["email"] = EmailMarketingAgent(model_name=self.model_name)
    
    def get_available_agents(self) -> List[AgentInfo]:
        """Return metadata for all available agents."""
        return [agent.agent_info for agent in self.agents.values()]
    
    def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """Get a specific agent by ID."""
        return self.agents.get(agent_id)
    
    def set_product_context(self, context: ProductContext) -> None:
        """Set product context for all agents."""
        for agent in self.agents.values():
            agent.set_product_context(context)
    
    def _detect_best_agent(self, user_message: str) -> BaseAgent:
        """
        Analyze user intent and return the best agent for the request.
        
        Uses each agent's can_handle() method to get confidence scores.
        Defaults to Twitter agent if scores are tied (prioritizing Twitter).
        """
        best_agent = None
        best_score = -1
        
        for agent_id, agent in self.agents.items():
            score = agent.can_handle(user_message)
            
            # Prefer Twitter agent in case of tie (prioritize Twitter/X)
            if score > best_score or (score == best_score and agent_id == "twitter"):
                best_score = score
                best_agent = agent
        
        # Fallback to Twitter if no agents found
        if best_agent is None:
            best_agent = self.agents.get("twitter")
        
        return best_agent
    
    async def route_and_generate(
        self,
        user_message: str,
        agent_id: Optional[str] = None,
        product_context: Optional[ProductContext] = None,
        conversation_history: Optional[List[dict]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Route the request to the appropriate agent and stream the response.
        
        Args:
            user_message: The user's input message
            agent_id: Specific agent to use (None for auto-routing)
            product_context: Product/brand context for personalization
            conversation_history: Previous messages for context
            
        Yields:
            Text chunks as they stream from the selected agent
        """
        # Set product context if provided
        if product_context:
            self.set_product_context(product_context)
        
        # Determine which agent to use
        if agent_id and agent_id in self.agents:
            # Direct routing: user selected a specific agent
            agent = self.agents[agent_id]
        else:
            # Auto routing: detect best agent based on message
            agent = self._detect_best_agent(user_message)
        
        # Yield agent identifier first (for UI to show which agent responded)
        yield f"[AGENT:{agent.agent_info.id}]"
        
        # Generate and stream response
        async for chunk in agent.generate_response(user_message, conversation_history):
            yield chunk
    
    def get_routed_agent_info(
        self, 
        user_message: str, 
        agent_id: Optional[str] = None
    ) -> AgentInfo:
        """
        Get info about which agent would handle this request.
        
        Useful for UI to show user which agent will respond.
        """
        if agent_id and agent_id in self.agents:
            return self.agents[agent_id].agent_info
        else:
            agent = self._detect_best_agent(user_message)
            return agent.agent_info
