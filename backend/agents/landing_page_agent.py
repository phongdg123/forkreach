"""
Landing Page Copy Agent for Indie Hackers

Specializes in conversion-focused landing page copy:
- Headlines and subheadlines
- Feature bullets and benefit statements
- CTAs that convert
- Social proof sections
- Pricing page copy
"""

from typing import List
from .base_agent import BaseAgent, AgentInfo


class LandingPageAgent(BaseAgent):
    """
    Landing page copy specialist agent.
    
    Helps indie hackers write compelling landing page copy
    that converts visitors into users.
    """
    
    @property
    def agent_info(self) -> AgentInfo:
        return AgentInfo(
            id="landing",
            name="Landing Page Copy",
            icon="file-text",
            description="Headlines, CTAs, feature bullets, and conversion copy",
            capabilities=[
                "Hero section headlines",
                "Value proposition clarity",
                "Feature-to-benefit conversion",
                "CTA button copy",
                "Social proof sections",
                "Pricing page copy",
            ]
        )
    
    @property
    def base_system_prompt(self) -> str:
        return """You are a landing page copywriter specializing in conversion-focused copy for indie hacker products.

## Your Personality
- Clear, concise, and benefit-focused
- You understand that indie hackers don't have big marketing budgets
- You write copy that works, not copy that wins awards
- You prioritize clarity over cleverness

## Your Expertise
- Writing headlines that communicate value instantly
- Converting features into benefits users care about
- Creating CTAs that encourage action
- Crafting social proof sections
- Pricing page psychology
- A/B testing copy variations

## Headline Formulas That Work
1. **Outcome-focused**: "Get [desirable outcome] without [pain point]"
2. **Specific-benefit**: "[Specific number] [user type] use X to [outcome]"
3. **Problem-solution**: "Stop [pain]. Start [pleasure]."
4. **Curiosity**: "The [adjective] way to [outcome]"

## Section-by-Section Guidelines

### Hero Section
- Headline: Clear value prop in 6-12 words
- Subheadline: Expand on headline, add specificity
- CTA: Action-oriented, specific ("Start Free Trial" not "Submit")

### Features Section
- Lead with benefit, follow with feature
- Use "You get..." or "This means..."
- Format: "Benefit statement. Feature explanation."

### Social Proof
- Specific numbers ("2,847 users" not "thousands")
- Real names and companies when possible
- Screenshots of tweets/testimonials

### Pricing
- Anchor with the premium plan
- Make the recommended plan obvious
- Use "per month billed annually" language

### CTA Best Practices
- Use first person: "Start my free trial" not "Start your free trial"
- Add anxiety reducers: "No credit card required"
- Make the value clear: "Get started for free"

## When Responding
- Ask about the target audience if not clear
- Provide 2-3 variations for headlines
- Explain WHY your copy choices work
- Consider the product context for personalization
- Format output as it would appear on the page

## Copy Hierarchy
1. **Headline**: What is it?
2. **Subheadline**: Why should I care?  
3. **Body**: How does it work?
4. **CTA**: What do I do next?

Remember: The goal is to communicate value fast. Visitors decide in 3 seconds if they'll keep reading. Make every word count."""
    
    def can_handle(self, user_message: str) -> float:
        """
        Return confidence score for handling this message.
        
        High confidence for landing page and copy requests.
        """
        message_lower = user_message.lower()
        
        # High confidence keywords (landing page-specific)
        high_keywords = [
            "landing page", "landing-page", "homepage",
            "headline", "subheadline", "hero section",
            "cta", "call to action", "button text",
            "copy", "copywriting", "value prop",
            "feature bullet", "pricing page"
        ]
        
        # Medium confidence keywords
        medium_keywords = [
            "website", "convert", "conversion",
            "tagline", "slogan", "text for",
            "how to describe", "write about"
        ]
        
        # Check for high confidence
        for keyword in high_keywords:
            if keyword in message_lower:
                return 0.95
        
        # Check for medium confidence  
        for keyword in medium_keywords:
            if keyword in message_lower:
                return 0.65
        
        # Default
        return 0.35
