"""
Multi-AI Marketing Agents for Indie Hackers

This module provides specialized AI agents for marketing tasks:
- TwitterAgent: Twitter/X thread and post generation
- LaunchStrategistAgent: Product Hunt, Hacker News, Reddit strategies
- LandingPageAgent: Landing page copy
- EmailMarketingAgent: Email sequences
"""

from .base_agent import BaseAgent, AgentInfo, ProductContext
from .twitter_agent import TwitterAgent
from .launch_strategist_agent import LaunchStrategistAgent
from .landing_page_agent import LandingPageAgent
from .email_marketing_agent import EmailMarketingAgent
from .coordinator import Coordinator

__all__ = [
    "BaseAgent",
    "AgentInfo", 
    "ProductContext",
    "TwitterAgent",
    "LaunchStrategistAgent",
    "LandingPageAgent",
    "EmailMarketingAgent",
    "Coordinator",
]
