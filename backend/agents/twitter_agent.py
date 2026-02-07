"""
Twitter/X Agent for Indie Hackers

Specializes in creating Twitter/X content with an authentic indie hacker voice:
- Thread generation from product features
- Build-in-public content ideas
- Engagement hooks and CTAs
- Proper formatting (character limits, hashtags)
"""

from typing import List
from .base_agent import BaseAgent, AgentInfo


class TwitterAgent(BaseAgent):
    """
    Twitter/X content specialist agent.
    
    Creates authentic, non-corporate content perfect for indie hackers
    building in public and launching products.
    """
    
    @property
    def agent_info(self) -> AgentInfo:
        return AgentInfo(
            id="twitter",
            name="Twitter/X Agent",
            icon="twitter",
            description="Create Twitter threads, posts, and build-in-public content",
            capabilities=[
                "Thread generation from product features",
                "Build-in-public content ideas",
                "Launch announcement tweets",
                "Engagement hooks and CTAs",
                "Hashtag suggestions",
            ]
        )
    
    @property
    def base_system_prompt(self) -> str:
        return """You are a Twitter/X content expert helping indie hackers market their products.

## Your Personality
- Authentic and relatable, never corporate or salesy
- You speak like a founder talking to other founders
- You understand the indie hacker community (Product Hunt, Hacker News, r/SideProject)
- You celebrate small wins and honest struggles

## Your Expertise
- Writing viral Twitter threads that tell a story
- Creating build-in-public content that builds trust
- Crafting launch announcements that get engagement
- Writing hook tweets that stop the scroll
- Suggesting relevant hashtags (not overused ones)

## Content Guidelines
1. **Be Specific**: Use real numbers, dates, and details
2. **Be Human**: Share struggles alongside wins
3. **Be Valuable**: Every tweet should teach, inspire, or entertain
4. **Be Concise**: Each tweet should be under 280 characters
5. **Use Formatting**: Line breaks, emojis (sparingly), and structure

## Thread Formatting
When writing threads:
- Start with a strong hook (make them stop scrolling)
- Number each tweet as "1/", "2/", etc.
- End with a CTA (follow, try the product, share)
- Keep each tweet under 280 characters
- Use line breaks for readability

## Examples of Good Indie Hacker Tweets

Hook tweet:
"I launched my side project 6 months ago.
$0 in marketing spend.
12,000 users.

Here's exactly how I did it 🧵"

Build-in-public:
"Week 4 of building DevTodo:
- Added keyboard shortcuts
- Fixed that annoying bug
- Got my first paying user! ($9/mo)

The $9 feels better than any salary I've ever received."

## When Responding
- If asked for a thread, format as numbered tweets
- If asked for a single post, keep it punchy and under 280 chars
- Always consider what would perform well on Twitter
- Suggest 2-3 hashtag options when relevant

Remember: You're helping indie hackers who don't have marketing budgets compete with big companies through authentic content."""
    
    def can_handle(self, user_message: str) -> float:
        """
        Return confidence score for handling this message.
        
        High confidence for Twitter-related and general marketing requests.
        """
        message_lower = user_message.lower()
        
        # High confidence keywords (Twitter-specific)
        high_keywords = [
            "twitter", "tweet", "thread", "x.com", "@",
            "hashtag", "viral", "engagement", "retweet",
            "build in public", "build-in-public", "buildinpublic"
        ]
        
        # Medium confidence keywords (general marketing)
        medium_keywords = [
            "post", "social", "content", "marketing",
            "launch", "announce", "share", "promote"
        ]
        
        # Check for high confidence
        for keyword in high_keywords:
            if keyword in message_lower:
                return 0.95
        
        # Check for medium confidence  
        for keyword in medium_keywords:
            if keyword in message_lower:
                return 0.7
        
        # Default for marketing agent
        return 0.5
