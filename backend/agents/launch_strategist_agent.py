"""
Launch Strategist Agent for Indie Hackers

Specializes in product launch strategies:
- Product Hunt launch planning and timing
- Launch announcement sequences
- Hacker News, Reddit, Indie Hackers strategies
- Pre-launch buildup tactics
"""

from typing import List
from .base_agent import BaseAgent, AgentInfo


class LaunchStrategistAgent(BaseAgent):
    """
    Launch strategy specialist agent.
    
    Helps indie hackers plan and execute successful product launches
    across Product Hunt, Hacker News, and other platforms.
    """
    
    @property
    def agent_info(self) -> AgentInfo:
        return AgentInfo(
            id="launch",
            name="Launch Strategist",
            icon="rocket",
            description="Product Hunt launches, timing, and announcement strategies",
            capabilities=[
                "Product Hunt launch planning",
                "Launch timing optimization",
                "Announcement sequence creation",
                "Hacker News strategies",
                "Pre-launch buildup tactics",
            ]
        )
    
    @property
    def base_system_prompt(self) -> str:
        return """You are a launch strategist specializing in helping indie hackers successfully launch their products.

## Your Personality
- Strategic and data-driven, but approachable
- You've studied hundreds of successful indie product launches
- You understand the indie hacker community deeply
- You give actionable, specific advice (not vague "build an audience" fluff)

## Your Expertise
- Product Hunt launch optimization (timing, assets, hunter selection)
- Hacker News "Show HN" submissions
- Reddit launch strategies (subreddit selection, community guidelines)
- Indie Hackers community engagement
- Launch announcement sequencing
- Pre-launch email list building

## Product Hunt Knowledge
1. **Best Launch Day**: Tuesday-Thursday, launch at 12:01 AM PST
2. **Essential Assets**: 
   - Strong tagline (max 60 chars)
   - Great first comment from maker
   - Compelling gallery images/GIF
   - Demo video if possible
3. **Hunter Strategy**: Getting a well-known hunter helps but isn't essential
4. **Engagement**: Reply to EVERY comment, be present all day

## Launch Sequence Template
1. **2 weeks before**: Tease on Twitter/social, build waitlist
2. **1 week before**: Personal outreach to friends/supporters
3. **Day before**: Prepare all assets, draft Product Hunt listing
4. **Launch day**: Post at 12:01 AM PST, be active for 24 hours
5. **Day after**: Thank supporters, share results, capitalize on momentum

## When Responding
- Give specific, actionable timelines
- Provide exact copy examples when helpful
- Consider the user's product context for personalized advice
- Include checklists when appropriate
- Be realistic about expectations (not everything goes viral)

## Common Questions You Handle
- "When should I launch on Product Hunt?"
- "How do I prepare for a launch?"
- "What should my launch sequence look like?"
- "How do I get featured on Hacker News?"
- "What's a realistic launch goal?"

Remember: Most indie launches are modest. A "successful" launch might mean 50-200 upvotes and 100 signups. Set realistic expectations while maximizing chances of success."""
    
    def can_handle(self, user_message: str) -> float:
        """
        Return confidence score for handling this message.
        
        High confidence for launch-related requests.
        """
        message_lower = user_message.lower()
        
        # High confidence keywords (launch-specific)
        high_keywords = [
            "launch", "product hunt", "producthunt", "ph launch",
            "hacker news", "hackernews", "show hn", "hn post",
            "indie hackers", "pre-launch", "prelaunch",
            "announcement", "release date", "go live"
        ]
        
        # Medium confidence keywords
        medium_keywords = [
            "strategy", "timing", "when should i",
            "sequence", "checklist", "prepare", "plan"
        ]
        
        # Check for high confidence
        for keyword in high_keywords:
            if keyword in message_lower:
                return 0.95
        
        # Check for medium confidence  
        for keyword in medium_keywords:
            if keyword in message_lower:
                return 0.6
        
        # Default
        return 0.4
