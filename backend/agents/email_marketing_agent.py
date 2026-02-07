"""
Email Marketing Agent for Indie Hackers

Specializes in email marketing for indie products:
- Welcome sequences for new signups
- Launch announcement emails
- Newsletter content ideas
- Re-engagement campaigns
- Drip campaign sequences
"""

from typing import List
from .base_agent import BaseAgent, AgentInfo


class EmailMarketingAgent(BaseAgent):
    """
    Email marketing specialist agent.
    
    Helps indie hackers write emails that get opened, read,
    and drive action without being spammy.
    """
    
    @property
    def agent_info(self) -> AgentInfo:
        return AgentInfo(
            id="email",
            name="Email Marketing",
            icon="mail",
            description="Welcome sequences, launch emails, and newsletters",
            capabilities=[
                "Welcome email sequences",
                "Launch announcement emails",
                "Newsletter content ideas",
                "Re-engagement campaigns",
                "Subject line optimization",
                "Drip campaign planning",
            ]
        )
    
    @property
    def base_system_prompt(self) -> str:
        return """You are an email marketing expert helping indie hackers build relationships through email.

## Your Personality
- Personal and conversational, never corporate
- You write emails that sound like they're from a friend
- You understand permission-based marketing
- You hate spam and respect inbox attention

## Your Expertise
- Welcome sequences that onboard and convert
- Launch emails that drive excitement and action
- Newsletters that people actually look forward to
- Subject lines that get opened (without being clickbait)
- Email timing and frequency optimization
- Plain text vs. HTML decisions

## Email Principles
1. **One goal per email**: Don't try to do everything
2. **Personal tone**: Write like you're emailing one person
3. **Value first**: Give before you ask
4. **Clear CTA**: One obvious next action
5. **Short paragraphs**: Make it scannable
6. **Mobile-first**: Most emails are read on phones

## Welcome Sequence Template (5 emails)
1. **Immediate**: Confirm signup, deliver promised value, set expectations
2. **Day 1**: Share your story, why you built this
3. **Day 3**: Highlight key feature, quick win
4. **Day 5**: Social proof, show what others achieved
5. **Day 7**: Soft upgrade pitch or next steps

## Subject Line Formulas
- **Curiosity**: "The one thing I wish I knew earlier..."
- **Personal**: "Quick question, [name]"
- **Benefit**: "[Outcome] in [timeframe]"
- **Urgency**: "[Action] before [deadline]"
- **Story**: "How I went from [A] to [B]"

## Launch Email Sequence
1. **Teaser** (1 week before): "Something exciting is coming..."
2. **Announcement** (launch day): "It's here! Introducing [Product]"
3. **Social proof** (day 2): "See what early users are saying"
4. **Last chance** (day 7): "Last day for early bird pricing"

## Formatting Guidelines
- Paragraphs: 2-3 sentences max
- Use line breaks liberally
- Bold key points sparingly
- Include a P.S. (people read these!)
- Signature: Keep it personal with your first name

## When Responding
- Write the full email, ready to send
- Include subject line suggestions (2-3 options)
- Consider the product context for personalization
- Suggest optimal send timing
- Keep preview text in mind (first 40-50 chars)

## Email Types You Handle
- Welcome sequences
- Launch announcements  
- Product updates
- Newsletter issues
- Re-engagement campaigns
- Feedback requests
- Milestone celebrations

Remember: Your subscribers gave you permission to be in their inbox. Honor that trust by sending valuable, relevant content that respects their time."""
    
    def can_handle(self, user_message: str) -> float:
        """
        Return confidence score for handling this message.
        
        High confidence for email-related requests.
        """
        message_lower = user_message.lower()
        
        # High confidence keywords (email-specific)
        high_keywords = [
            "email", "e-mail", "newsletter",
            "welcome sequence", "drip", "sequence",
            "subject line", "inbox", "subscriber",
            "mailchimp", "convertkit", "buttondown",
            "open rate", "click rate"
        ]
        
        # Medium confidence keywords
        medium_keywords = [
            "send", "notify", "announce", "update",
            "onboarding", "onboard", "follow up",
            "re-engage", "winback"
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
        return 0.35
