# Persona Onboarding — Design

## Design Philosophy

Apple-inspired. Every pixel earns its place. The interface should feel like unwrapping a product — deliberate reveals, generous whitespace, and typography that breathes. No clutter. No chrome. Just the conversation.

**Principles:**
- Content is the interface — no visible containers, no card borders
- Motion is meaning — every animation communicates state, nothing decorates
- Progressive disclosure — show only what matters right now
- Depth through subtlety — soft shadows, layered translucency, not hard edges
- One action per screen — never overwhelm

## Visual Language

### Color

```
Background:       #000000 (pure black)
Surface:          #1C1C1E (elevated surfaces, iOS system gray 6)
Surface Elevated: #2C2C2E (modals, popovers)
Text Primary:     #FFFFFF
Text Secondary:   #8E8E93 (iOS system gray)
Text Tertiary:    #48484A
Accent:           #0A84FF (iOS blue)
Accent Hover:     #409CFF
Success:          #30D158
Destructive:      #FF453A
Gmail Red:        #EA4335
Divider:          rgba(255,255,255,0.08)
Glass:            rgba(28,28,30,0.72) + backdrop-blur(40px)
```

### Typography

```
Font:             SF Pro Display / Inter (fallback)
Hero Title:       48px / 700 / -0.02em tracking
Section Title:    28px / 600 / -0.02em
Body:             17px / 400 / -0.01em (iOS standard)
Caption:          13px / 400 / 0
Button:           17px / 600
Monospace:        SF Mono / JetBrains Mono
```

### Spacing & Layout

```
Max content width: 680px (centered)
Vertical rhythm:   8px base unit
Section padding:   80px vertical
Element gaps:      16px / 24px / 32px
Border radius:     16px (cards) / 12px (buttons) / 24px (pills)
```

### Motion

```
Duration:          300ms (micro), 500ms (transitions), 800ms (reveals)
Easing:            cubic-bezier(0.25, 0.1, 0.25, 1) — Apple ease
Spring:            cubic-bezier(0.34, 1.56, 0.64, 1) — bounce-in
Stagger:           80ms between sequential elements
```

## User Flow

```
 WELCOME                    VOICE CALL                TEXT FALLBACK            GRADUATION
 ──────────────────         ──────────────────        ──────────────────       ──────────────────
 Full-screen black          Full-screen takeover      Minimal chat UI          Summary + launch
 Centered type              Frosted glass overlay     Same black canvas        Animated checkmarks
 "What should we            Pulsing waveform          Messages fade in         "You're all set."
  call your agent?"         Soft glow accent          one at a time            CTA to continue
                            Accept / Decline
 Text input appears         buttons at bottom         Gmail card slides
 with fade + rise                                     in inline

        │                          │                         │                        │
        ▼                          ▼                         ▼                        ▼
   agentName ──────────► call collects ──────────► fills gaps ──────────► graduated
                         userName, gmail,           for anything
                         userNeed via               missed
                         client tools
```

## Step 1: Welcome

**Layout:** Full viewport. Pure black. Content vertically and horizontally centered. Nothing else on screen.

**Sequence:**
1. Pause (400ms), then the agent name fades in: large, white, hero typography
2. Below it, a subtitle fades in (staggered 200ms): "Let's set up your Persona." in secondary gray
3. After 600ms, a single text input rises from below (transform + opacity). No label. Placeholder text: "Give your agent a name..." in tertiary gray
4. Input is minimal — no border, just a thin bottom line (divider color). Text appears in white as user types
5. User presses Enter. The input text scales up slightly and crossfades into the confirmed agent name. The rest of the UI fades out downward.

**Details:**
- No submit button. Enter key only. Feels like typing into void.
- If the user types nothing and hits enter, the placeholder gently shakes (Apple-style error shake, 4px amplitude, 3 cycles)
- Subtle cursor blink animation on the input

## Step 2: Voice Call

**Trigger:** After agent name is confirmed, a 1.5s pause. Then the call UI rises from the bottom.

**Incoming Call Screen:**
- Full viewport overlay with glass background (frosted black, `backdrop-blur(40px)`)
- Centered vertically:
  - Agent avatar: 96px circle, soft gradient fill (accent blue to purple), agent's initial letter centered in white
  - Agent name in section title weight, white
  - "is calling..." in secondary gray, with a subtle opacity pulse (1s cycle)
- Bottom of screen, 48px from bottom edge:
  - Two circular buttons, 64px diameter, spaced 120px apart
  - **Decline:** `#FF453A` background, phone-down icon, white
  - **Accept:** `#30D158` background, phone-up icon, white
  - Both have a soft glow shadow matching their color (`0 0 30px rgba(color, 0.4)`)
  - Gentle scale pulse on the accept button (1.02x, 2s cycle) to draw attention

**Active Call Screen:**
- Black background
- Center of screen: audio waveform visualization
  - 5 vertical bars, rounded ends, accent blue
  - Heights animate reactively to voice volume (isSpeaking state)
  - When idle: bars settle to uniform 4px height with gentle bob
  - When speaking: bars dance between 8px and 48px, staggered
- Agent name above waveform, small, secondary gray
- "Listening..." or "Speaking..." label below waveform, caption size, tertiary gray
- Bottom: single circular end-call button, 56px, `#FF453A`, centered
- No timer, no extra UI. Just the conversation.

**Stage streaming:** As the agent collects info during the call, no visible UI changes. The data flows silently to state. The user only experiences the voice.

**Hangup / End:** The waveform bars shrink to zero. The screen fades to black (300ms). Then transitions to either Graduation (if complete) or Text Fallback (if items remain).

## Step 3: Text Fallback

**Trigger:** Call declined, ended early, or user never accepted.

**Layout:** Black background. Messages appear in a vertically-centered column (max-width 480px). No chat chrome — no header bar, no input box visible initially.

**Message Style:**
- Agent messages: left-aligned, `#2C2C2E` background, 16px border-radius, body text in white. Max-width 85%.
- User messages: right-aligned, accent blue background, white text, same radius. Max-width 85%.
- Each message fades in + rises (translateY 12px -> 0, 300ms)
- 600ms pause between agent messages to simulate typing
- No typing indicator dots. The pause itself is the indicator. Clean.

**Flow:**
- Agent only asks for fields not yet collected
- One question at a time. Never stacks questions.
- After user responds, agent acknowledges briefly, then moves to next field
- Gmail connection appears as an inline card (see Step 4) instead of a text question

**Input:**
- A minimal input bar rises from bottom when it's the user's turn
- Same style as Welcome: no border, just a bottom divider line
- Placeholder: "Type a message..." in tertiary gray
- Send on Enter. No send button.

## Step 4: Gmail Connection

**Trigger:** Either during voice call (via `requestGmailConnect` client tool) or inline during text fallback.

**Inline Card:**
- Appears in the message flow as an agent-side element
- Glass surface (`rgba(28,28,30,0.72)`, blur, 16px radius)
- Gmail icon (simplified, `#EA4335`) on the left
- "Connect your Gmail" in body text, white
- "So I can help manage your email" in caption, secondary gray
- Right side: a pill-shaped "Connect" button, accent blue background, white text, 24px radius
- Card fades in + rises like a message

**On Click:**
- Button text crossfades to a spinner (16px, white, 1s rotation)
- After 1.5s simulated delay:
  - Spinner crossfades to a checkmark icon (success green)
  - "Connect" text becomes "Connected" in success green
  - Subtle scale pop (1.02x, spring easing)
- Card stays in the flow, now in completed state

**Decline:**
- Small "Skip" text link below the card, tertiary gray, caption size
- On click: card fades to 50% opacity, "Skipped" replaces "Connect", tertiary gray
- No further Gmail prompts

## Step 5: Graduation

**Trigger:** All required fields collected (agentName + userName + userNeed). Gmail is optional.

**Layout:** Full viewport. Black. Centered content.

**Sequence:**
1. Brief black pause (500ms)
2. A large checkmark draws itself (SVG stroke animation, accent blue, 800ms, ease-out)
3. Below it, hero title fades in: "You're all set." white, centered
4. After 400ms, a summary block fades in. Clean vertical list:
   - Each item: label in secondary gray (caption), value in white (body)
   - Items: Agent Name, Your Name, Gmail (or "Not connected"), Primary Need
   - Each item staggers in by 80ms
5. After all items visible, a CTA button fades in at bottom:
   - Full-width (within max-width), accent blue, 12px radius, 56px height
   - "Get Started" in white, button weight
   - Subtle glow: `0 4px 24px rgba(10,132,255,0.3)`

**Details:**
- If Gmail was skipped, that row shows "Not connected" in tertiary gray with a small "Connect" text link
- The checkmark uses `stroke-dasharray` / `stroke-dashoffset` for the draw animation

## State Machine

```typescript
interface OnboardingState {
  agentName: string | null;
  userName: string | null;
  gmail: string | null;
  gmailConnected: boolean;
  userNeed: string | null;
  callStatus: 'pending' | 'ringing' | 'active' | 'ended' | 'declined';
  callDeclined: boolean;
  gmailDeclined: boolean;
  graduated: boolean;
}
```

## Component Architecture

```
app/
├── page.tsx                    # Full-screen onboarding orchestrator
├── layout.tsx                  # Root layout, black body, font loading
├── api/
│   └── gmail-verify/
│       └── route.ts            # Simulated Gmail OAuth
├── components/
│   ├── OnboardingFlow.tsx      # State machine + animated step transitions
│   ├── WelcomeStep.tsx         # Agent naming — centered input
│   ├── CallStep.tsx            # Incoming call + active call + ElevenLabs
│   ├── TextFallback.tsx        # Minimal chat for missing fields
│   ├── GmailCard.tsx           # Inline connection card
│   ├── GraduationStep.tsx      # Checkmark + summary + CTA
│   ├── Waveform.tsx            # Audio visualization bars
│   └── AnimatedCheckmark.tsx   # SVG draw animation
├── lib/
│   ├── onboarding-state.ts     # State machine logic
│   ├── animations.ts           # Shared motion constants
│   └── types.ts                # TypeScript types
└── styles/
    └── globals.css             # Tailwind + CSS variables + animations
```

## Responsive Behavior

- Desktop: content centered, max-width 680px, generous vertical spacing
- Mobile: same layout, full-width with 24px horizontal padding, reduced vertical spacing (60px sections)
- Call buttons: same size on mobile, positioned with safe-area-inset-bottom
- Text input: full-width on mobile, auto-focus with keyboard push
- No layout shifts — everything is centered and flows vertically
