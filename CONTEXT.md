# Persona Onboarding — Project Context

## What This Is
A conversational onboarding experience for Persona, deployed to Vercel. It collects four pieces of information through a mix of voice (ElevenLabs) and text, designed to feel like a conversation — not a form.

## What We Collect
1. **Agent name** — what the user wants to call their AI assistant
2. **User's name** — what the agent should call them
3. **Connected Gmail** — validated via simulated OAuth flow
4. **What the user needs help with** — their use case / pain point

## Core Principle: Stage Streaming
The voice call is NOT a black box. As the ElevenLabs agent collects each piece of info during the call, it calls client tools (`updateStage`) to push data back to the frontend in real-time. If the user hangs up, the text UI instantly knows what's been collected and only asks for what's missing.

## Conversational Intelligence
The onboarding agent isn't just collecting fields — it's demonstrating Persona's value. This means:
- The agent should understand what Persona does and how it helps
- It should ask follow-up questions about the user's workflow and pain points
- It should connect the user's needs to specific Persona capabilities
- It should selectively update a data store with relevant insights (not just the 4 fields)
- The voice prompt is the heart of this — it needs to be warm, knowledgeable, and adaptive

**Note:** The voice prompt / conversational intelligence layer will be refined after scaffolding. The ElevenLabs agent config and system prompt are where most of the magic lives, and that's a tuning exercise best done once the skeleton works.

## Resilience Requirements
- Handles hangups: text picks up where voice left off
- Handles call decline: graceful text fallback
- Handles chaos: gibberish, refusals, out-of-order info, prompt injection
- Max 2 gentle attempts per field, then move on
- Declined flows (call, Gmail) are respected — no nagging
- Early graduation: if user has all info or a clear task, let them skip ahead

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- ElevenLabs (`@elevenlabs/react`) — WebRTC voice in browser
- ElevenLabs client tools — stream stage data from voice to app
- Simulated Gmail OAuth
- Vercel deployment

## Environment Variables Needed
- `ELEVENLABS_API_KEY` — for agent configuration
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` — agent ID for frontend
