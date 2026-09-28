# Persona Onboarding — Design

## User Flow

```
┌──────────────────────────────────────────────────┐
│ 1. WELCOME                                       │
│    Clean landing. "Let's set up your Persona."   │
│    Brief text exchange to name the agent.         │
│    Conversational — not a text input + submit.    │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│ 2. VOICE CALL                                    │
│    "Your agent wants to introduce themselves."    │
│    Incoming call UI → Accept / Decline            │
│                                                   │
│    ON ACCEPT:                                     │
│    Agent conversationally collects:               │
│    - User's name                                  │
│    - Gmail (offers connection card)               │
│    - What they need help with                     │
│    - Asks follow-up questions about their needs   │
│    Each piece streams back via clientTools         │
│                                                   │
│    ON DECLINE / HANGUP:                           │
│    Transition to text. Pick up where left off.    │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│ 3. TEXT FALLBACK (if needed)                     │
│    Chat-style UI. Only asks for missing items.   │
│    Same conversational tone as voice.             │
│    Gmail connection card appears inline.          │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│ 4. GMAIL CONNECTION                              │
│    Simulated OAuth popup or inline card.          │
│    "Connect your Gmail so I can help with email." │
│    Click → popup → confirm → connected state.     │
└──────────────┬───────────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────┐
│ 5. GRADUATION                                    │
│    Summary of setup. Transition to main app.      │
│    "Here's what I know. Ready to get started?"    │
│    Can happen early if all info is collected.      │
└──────────────────────────────────────────────────┘
```

## Stage State Machine

```typescript
interface OnboardingState {
  agentName: string | null;       // Step 1 (text)
  userName: string | null;        // Step 2 (voice/text)
  gmail: string | null;           // Step 2-3 (voice/text + OAuth)
  gmailConnected: boolean;        // OAuth confirmation
  userNeed: string | null;        // Step 2-3 (voice/text)
  callStatus: 'pending' | 'ringing' | 'active' | 'ended' | 'declined';
  callDeclined: boolean;          // Don't re-prompt
  gmailDeclined: boolean;         // Don't re-prompt
  graduated: boolean;
}
```

## Stage Streaming (Voice → Frontend)

ElevenLabs client tools registered on startSession:

```typescript
clientTools: {
  updateStage: async ({ field, value }) => {
    // field: "userName" | "gmail" | "userNeed"
    // Updates React state immediately
    // Persists to backend/store
    setOnboardingState(prev => ({ ...prev, [field]: value }));
    return "confirmed";
  },
  requestGmailConnect: async () => {
    // Triggers Gmail OAuth popup from within the call
    openGmailPopup();
    return "gmail connection initiated";
  }
}
```

## Visual Design Direction

- Clean, modern, minimal — not trying to clone iMessage
- Dark or light mode, Persona brand colors
- Chat bubbles for text interaction
- Full-screen call UI with avatar/waveform when voice is active
- Smooth transitions between voice and text states
- Mobile-responsive

## Component Architecture

```
app/
├── page.tsx                    # Main onboarding orchestrator
├── layout.tsx                  # Root layout + providers
├── api/
│   └── gmail-verify/
│       └── route.ts            # Simulated Gmail OAuth callback
├── components/
│   ├── OnboardingFlow.tsx      # State machine + step router
│   ├── WelcomeStep.tsx         # Agent naming (text chat)
│   ├── CallStep.tsx            # Voice call UI + ElevenLabs
│   ├── TextFallback.tsx        # Text chat for missing items
│   ├── GmailConnect.tsx        # OAuth simulation card
│   ├── GraduationStep.tsx      # Summary + transition
│   ├── ChatBubble.tsx          # Reusable chat message
│   └── CallUI.tsx              # In-call interface (waveform, controls)
├── lib/
│   ├── onboarding-state.ts     # State machine logic
│   └── types.ts                # TypeScript types
└── styles/
    └── globals.css             # Tailwind + custom styles
```
