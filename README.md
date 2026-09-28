# Persona — Conversational Onboarding

A voice-first onboarding experience that sets up a personal AI assistant through natural conversation. Built for the Persona technical interview. Collects four pieces of information — agent name, user name, Gmail connection, and user need — through a mix of voice (ElevenLabs) and text, styled after Apple's design language.

**Live:** Deployed to Vercel

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER                                    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ConversationProvider  (@elevenlabs/react)                  │   │
│  │                                                             │   │
│  │  ┌───────────────────────────────────────────────────────┐ │   │
│  │  │  OnboardingFlow  (state machine + phase router)       │ │   │
│  │  │                                                       │ │   │
│  │  │  Phase: "naming"        → WelcomeStep                 │ │   │
│  │  │  Phase: "calling"       → CallUI                      │ │   │
│  │  │  Phase: "text-collect"  → TextFallback (chat)         │ │   │
│  │  │  Phase: "done"          → GraduationStep              │ │   │
│  │  └───────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Voice Call (WebRTC)          Client Tools (during call)            │
│  ┌─────────────────┐         ┌──────────────────────────┐          │
│  │ ElevenLabs Agent │◄───────►│ updateStage(field, value)│──► state │
│  │ (cloud-hosted)   │         │ requestGmailConnect()    │──► UI   │
│  └─────────────────┘         └──────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### How It Works

1. **Welcome** — User names their agent via a centered text input on a black canvas
2. **Voice Call** — Agent "calls" the user. ElevenLabs handles voice via WebRTC. During the call, the agent uses client tools to stream collected data (name, email, need) back to React state in real-time
3. **Text Fallback** — If the user declines or hangs up mid-call, a chat UI picks up where voice left off, only asking for missing fields
4. **Graduation** — Summary screen with animated checkmark and all collected info

The key insight is **stage streaming**: the voice call is not a black box. Every piece of info the agent collects is pushed to the frontend immediately via `updateStage`, so a hangup at any point results in a seamless text continuation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Voice | ElevenLabs Conversational AI (`@elevenlabs/react`) via WebRTC |
| Design | Apple design system — SF Pro / Inter, Action Blue #0066cc, dark canvas |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout — Inter font, black body, ConversationProvider
│   ├── page.tsx                   # Entry point — renders OnboardingFlow
│   ├── globals.css                # Apple design tokens (CSS vars), animations, Tailwind
│   └── favicon.ico
│
├── components/
│   ├── Providers.tsx              # ElevenLabs ConversationProvider wrapper
│   ├── OnboardingFlow.tsx         # State machine — routes phases, manages all onboarding logic
│   ├── CallUI.tsx                 # Voice call — incoming screen, active call, waveform, ElevenLabs session
│   ├── ChatBubble.tsx             # Message bubble — agent (dark tile) / user (blue) / system (centered gray)
│   ├── ChatInput.tsx              # Minimal input — no border, Enter to send, shake on empty
│   ├── GmailConnect.tsx           # Gmail card — email input, connect/skip, spinner → checkmark
│   └── GraduationStep.tsx         # Summary — animated SVG checkmark, field list, "Get Started" CTA
│
└── lib/
    ├── types.ts                   # OnboardingState, ChatMessage, initialOnboardingState
    └── onboarding-state.ts        # getMissingFields(), isOnboardingComplete()
```

## State Machine

```
OnboardingState {
  agentName       — collected in "naming" phase (text)
  userName        — collected in "calling" or "text-collect" phase
  gmail           — collected via GmailConnect card or voice
  gmailConnected  — true after simulated OAuth
  userNeed        — collected in "calling" or "text-collect" phase
  callStatus      — pending → ringing → active → ended | declined
  callDeclined    — prevents re-prompting
  gmailDeclined   — prevents re-prompting
  graduated       — triggers "done" phase
}
```

**Phase transitions:**

```
naming ──(agent named)──► calling ──(call ends, items remain)──► text-collect ──(complete)──► done
                              │                                                                 ▲
                              │──(call declined)──► text-collect ──(complete)───────────────────│
                              │──(all collected during call)────────────────────────────────────│
```

## ElevenLabs Voice Agent

The voice agent is configured in the ElevenLabs dashboard with:

- **System prompt** that gives it the agent name and instructs it to collect userName, gmail, and userNeed conversationally
- **Client tools** registered at session start:
  - `updateStage({ field, value })` — pushes collected data to React state in real-time
  - `requestGmailConnect()` — triggers the Gmail connection card on the frontend
- **Dynamic variables** — `{{agentName}}` is passed from the frontend when starting the session

The agent collects one field at a time, calls `updateStage` immediately after each, and wraps up when done. If the user hangs up, the frontend knows exactly what was collected and what's missing.

## Design System

Apple-inspired. Full spec in `DESIGN.md` (with YAML frontmatter for exact token values).

- **Canvas:** Pure black (#000000). Content floats in void.
- **Color:** Single accent — Action Blue #0066cc (light surfaces), Sky Blue #2997ff (dark surfaces)
- **Typography:** SF Pro Display / Inter. 56px hero headlines with -0.28px tracking. 17px body.
- **Surfaces:** Dark tile #272729 for chat bubbles and cards. No borders, no shadows on chrome.
- **Motion:** Apple ease `cubic-bezier(0.25, 0.1, 0.25, 1)`. Fade+rise reveals. 80ms stagger. Spring ease for pops.
- **Interaction:** `scale(0.95)` on press. No send buttons — Enter key only. No typing dots — the pause is the indicator.
- **Radius:** 18px cards, 9999px pills, 11px utility

## Environment Variables

```env
ELEVENLABS_API_KEY=           # ElevenLabs API key (for agent config, not used at runtime)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=  # Agent ID from elevenlabs.io/app/conversational-ai
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Files

| File | What it does |
|---|---|
| `OnboardingFlow.tsx` | The brain — state machine, phase routing, message handling, field collection logic |
| `CallUI.tsx` | ElevenLabs integration — `useConversation`, client tools, waveform animation |
| `DESIGN.md` | Complete Apple design system with YAML tokens — colors, typography, spacing, components |
| `CONTEXT.md` | Product requirements — what we collect, resilience rules, stage streaming principle |
| `globals.css` | All CSS custom properties (design tokens) and keyframe animations |
