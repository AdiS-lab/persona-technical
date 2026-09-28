---
version: alpha
name: Persona-onboarding-apple-design
description: A conversational onboarding experience styled after Apple's design language. Photography-first surfaces, SF Pro Display headlines with negative letter-spacing, a single Action Blue interactive color, and near-invisible UI chrome. The interface recedes so the conversation can speak.

colors:
  primary: "#0066cc"
  primary-focus: "#0071e3"
  primary-on-dark: "#2997ff"
  ink: "#1d1d1f"
  body: "#1d1d1f"
  body-on-dark: "#ffffff"
  body-muted: "#cccccc"
  ink-muted-80: "#333333"
  ink-muted-48: "#7a7a7a"
  divider-soft: "#f0f0f0"
  hairline: "#e0e0e0"
  canvas: "#ffffff"
  canvas-parchment: "#f5f5f7"
  surface-pearl: "#fafafc"
  surface-tile-1: "#272729"
  surface-tile-2: "#2a2a2c"
  surface-tile-3: "#252527"
  surface-black: "#000000"
  surface-chip-translucent: "#d2d2d7"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  success: "#30d158"
  destructive: "#ff453a"
  gmail-red: "#ea4335"

typography:
  hero-display:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-lg:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: -0.374px
  lead:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.196px
  lead-airy:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: 0.231px
  body-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: -0.374px
  body:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.374px
  caption:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.224px
  caption-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: -0.224px
  button-large:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.224px
  fine-print:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px

rounded:
  none: 0px
  xs: 5px
  sm: 8px
  md: 11px
  lg: 18px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 17px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    transform: scale(0.95)
  button-secondary-pill:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
    border: 1px solid "{colors.primary}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 64px
  button-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
    size: 64px
  button-icon-circular:
    backgroundColor: "{colors.surface-chip-translucent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-on-dark}"
    typography: "{typography.body}"
  welcome-surface:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.hero-display}"
    padding: "{spacing.section}"
  call-overlay:
    backgroundColor: "rgba(0,0,0,0.85)"
    backdropFilter: "saturate(180%) blur(20px)"
    textColor: "{colors.on-dark}"
  call-waveform-bar:
    backgroundColor: "{colors.primary-on-dark}"
    rounded: "{rounded.pill}"
    width: 4px
  chat-bubble-agent:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
    maxWidth: 85%
  chat-bubble-user:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 12px 16px
    maxWidth: 85%
  gmail-card:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: 1px solid "rgba(255,255,255,0.08)"
  graduation-surface:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
  input-minimal:
    backgroundColor: transparent
    textColor: "{colors.on-dark}"
    typography: "{typography.lead}"
    borderBottom: 1px solid "rgba(255,255,255,0.08)"
    padding: 12px 0
---

## Overview

Persona's onboarding is a conversational experience styled after Apple's design language. The interface is a black canvas — content floats in void, no containers, no chrome. Typography is SF Pro Display at display sizes with negative letter-spacing. A single Action Blue (`{colors.primary}` #0066cc) carries every interactive element. Motion is deliberate and minimal. The product (the conversation) speaks; the UI disappears.

**Key Characteristics:**
- Pure black canvas with content centered in generous whitespace
- Single blue accent carries every interactive signal — no second brand color
- SF Pro Display + SF Pro Text — negative letter-spacing at display sizes for the "Apple tight" headline feel
- No decorative gradients, no shadows on chrome — depth comes from surface-color changes and backdrop-blur
- One action per screen — progressive disclosure, never overwhelm
- Motion communicates state, nothing decorates
- `transform: scale(0.95)` as the universal press/active micro-interaction

## User Flow

```
 WELCOME                    VOICE CALL                TEXT FALLBACK            GRADUATION
 ──────────────────         ──────────────────        ──────────────────       ──────────────────
 Full-screen black          Full-screen takeover      Minimal chat on black    Summary + launch
 Centered SF Pro Display    Frosted glass overlay     Messages fade in         Animated checkmark
 "What should we            Pulsing waveform          one at a time            "You're all set."
  call your agent?"         in Action Blue            Gmail card inline        CTA pill button
 Minimal input, no border   Accept / Decline
                            buttons at bottom

        │                          │                         │                        │
        ▼                          ▼                         ▼                        ▼
   agentName ──────────► call collects ──────────► fills gaps ──────────► graduated
                         userName, gmail,           for anything
                         userNeed via               missed
                         client tools
```

## Step 1: Welcome

**Surface:** `{component.welcome-surface}` — full viewport, `{colors.surface-black}`, content vertically and horizontally centered. Nothing else on screen.

**Sequence:**
1. Pause (400ms), then the headline fades in: `{typography.hero-display}` (56px / 600 / -0.28px tracking), `{colors.on-dark}`. Text: "Let's set up your Persona."
2. Below, subtitle fades in (staggered 200ms): `{typography.lead}` (28px / 400), `{colors.body-muted}`. Text: "First, give your agent a name."
3. After 600ms, `{component.input-minimal}` rises from below (translateY 16px → 0, opacity 0 → 1, 500ms, Apple ease). Placeholder in `{colors.ink-muted-48}`: "Name your agent..."
4. User types — text appears in `{colors.on-dark}`, `{typography.lead}` (28px)
5. Enter to confirm. Input text scales up slightly (1.02x, spring ease) and the surrounding UI fades out downward (300ms)

**Details:**
- No submit button. Enter key only. The void is the interface.
- Empty submit: input shakes (Apple error shake — 4px amplitude, 3 cycles, 300ms)
- Input has no visible border — only a bottom hairline in `rgba(255,255,255,0.08)`

## Step 2: Voice Call

**Trigger:** After agent name confirmed, 1.5s pause, then call UI rises from bottom.

### Incoming Call Screen

**Surface:** `{component.call-overlay}` — full viewport, frosted black (`rgba(0,0,0,0.85)` + `backdrop-filter: saturate(180%) blur(20px)`)

**Layout — centered vertically:**
- Agent avatar: 96px circle, soft gradient fill (`{colors.primary}` to `#5856d6`), agent's initial letter centered in `{colors.on-dark}`, `{typography.display-lg}`
- Agent name: `{typography.tagline}` (21px / 600), `{colors.on-dark}`, 8px below avatar
- Status: "is calling..." in `{typography.caption}`, `{colors.body-muted}`, subtle opacity pulse (1s cycle)

**Bottom — 48px from bottom edge, centered:**
- Two circular buttons, spaced 120px apart:
  - **Decline:** `{component.button-destructive}` — 64px circle, `{colors.destructive}` (#FF453A), phone-down icon in white
  - **Accept:** `{component.button-success}` — 64px circle, `{colors.success}` (#30D158), phone-up icon in white
  - Both: soft glow shadow `0 0 30px rgba(color, 0.3)`
  - Accept button: gentle scale pulse (1.0 → 1.03x, 2s cycle) to draw attention
  - Active state on both: `transform: scale(0.95)`

### Active Call Screen

**Surface:** `{colors.surface-black}`, full viewport

**Center of screen — audio waveform:**
- 5 vertical bars using `{component.call-waveform-bar}` — `{colors.primary-on-dark}` (#2997ff), 4px wide, `{rounded.pill}` ends
- Heights animate reactively to isSpeaking state:
  - Idle: uniform 4px height, gentle bob (translateY ±2px, 2s cycle, staggered 80ms)
  - Speaking: bars dance between 8px and 48px, staggered 80ms
- Agent name above waveform: `{typography.caption}`, `{colors.body-muted}`
- Status below waveform: "Listening..." or "Speaking..." in `{typography.fine-print}`, `{colors.ink-muted-48}`

**Bottom — centered:**
- Single end-call button: 56px circle, `{colors.destructive}`, phone-down icon, `{colors.on-dark}`
- Active: `transform: scale(0.95)`

**Stage streaming:** No visible UI changes during the call. Data flows silently to state via ElevenLabs client tools. The user only experiences the voice.

**Hangup / End:** Waveform bars shrink to 0 height (300ms). Screen fades to black (300ms). Transitions to Graduation (if complete) or Text Fallback (if items remain).

## Step 3: Text Fallback

**Trigger:** Call declined, ended early, or user never accepted.

**Surface:** `{colors.surface-black}`, full viewport. Messages appear in a vertically-centered column (max-width 480px). No chat chrome — no header bar, no input box visible initially.

**Message Style:**
- Agent messages: `{component.chat-bubble-agent}` — left-aligned, `{colors.surface-tile-1}` background, `{rounded.lg}` (18px), `{typography.body}` (17px / 400 / -0.374px), `{colors.on-dark}`. Max-width 85%.
- User messages: `{component.chat-bubble-user}` — right-aligned, `{colors.primary}` background, `{colors.on-primary}` text, same radius and typography. Max-width 85%.
- Each message fades in + rises (translateY 12px → 0, opacity 0 → 1, 300ms, Apple ease)
- 600ms pause between agent messages — the pause is the typing indicator. No dots. Clean.

**Flow:**
- Agent only asks for fields not yet collected (stage-aware)
- One question at a time. Never stacks questions.
- After user responds, brief acknowledgment, then next field
- Gmail connection appears as `{component.gmail-card}` inline (see Step 4)

**Input:**
- Rises from bottom when it's the user's turn
- `{component.input-minimal}` style — no border, bottom hairline only
- Placeholder: "Type a message..." in `{colors.ink-muted-48}`, `{typography.body}`
- Send on Enter. No send button.

## Step 4: Gmail Connection

**Trigger:** During voice call (via `requestGmailConnect` client tool) or inline during text fallback.

**Card:** `{component.gmail-card}` — appears in the message flow as an agent-side element.
- Background: `{colors.surface-tile-1}`, 1px border `rgba(255,255,255,0.08)`, `{rounded.lg}` (18px)
- Padding: `{spacing.lg}` (24px)
- Layout (horizontal):
  - Left: Gmail icon (simplified envelope), `{colors.gmail-red}` (#EA4335)
  - Center: "Connect your Gmail" in `{typography.body-strong}` (17px / 600), `{colors.on-dark}`. Below: "So I can help manage your email" in `{typography.caption}`, `{colors.body-muted}`
  - Right: `{component.button-primary}` pill — "Connect", `{colors.primary}` background, `{colors.on-primary}` text
- Card fades in + rises like a message (300ms)

**On Click:**
- Button text crossfades to a spinner (16px circle, `{colors.on-primary}`, 1s rotation)
- After 1.5s simulated delay:
  - Spinner crossfades to checkmark icon, `{colors.success}`
  - Text becomes "Connected" in `{colors.success}`
  - Subtle scale pop (1.02x, spring ease: `cubic-bezier(0.34, 1.56, 0.64, 1)`)

**Decline:**
- "Skip" text link below card: `{component.text-link-on-dark}` style but in `{colors.ink-muted-48}`, `{typography.caption}`
- On click: card fades to 50% opacity, button text becomes "Skipped" in `{colors.ink-muted-48}`
- No further Gmail prompts

## Step 5: Graduation

**Trigger:** All required fields collected (agentName + userName + userNeed). Gmail is optional.

**Surface:** `{component.graduation-surface}` — full viewport, `{colors.surface-black}`, centered content.

**Sequence:**
1. Black pause (500ms)
2. Animated checkmark draws itself: SVG stroke animation in `{colors.primary-on-dark}` (#2997ff), `stroke-dasharray` / `stroke-dashoffset`, 800ms, ease-out. Circle 64px diameter.
3. Below checkmark: "You're all set." in `{typography.hero-display}` (56px / 600 / -0.28px), `{colors.on-dark}`, fades in (300ms)
4. After 400ms, summary list fades in. Clean vertical stack, max-width 400px:
   - Each row: label in `{typography.caption}` / `{colors.body-muted}`, value in `{typography.body}` / `{colors.on-dark}`
   - Items: Agent Name, Your Name, Gmail (or "Not connected" in `{colors.ink-muted-48}`), Primary Need
   - Each row staggers in by 80ms
5. After all rows visible, CTA fades in:
   - `{component.button-primary}` — full width (within max-width), `{colors.primary}`, `{rounded.pill}`, 56px height
   - "Get Started" in `{typography.body}`, `{colors.on-primary}`
   - Subtle glow: `0 4px 24px rgba(0, 102, 204, 0.3)`

**Details:**
- If Gmail was skipped, that row shows "Not connected" in `{colors.ink-muted-48}` with a small `{component.text-link-on-dark}` "Connect" link
- Active state on CTA: `transform: scale(0.95)`

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

## Stage Streaming (Voice → Frontend)

ElevenLabs client tools registered on startSession:

```typescript
clientTools: {
  updateStage: async ({ field, value }) => {
    // field: "userName" | "gmail" | "userNeed"
    // Updates React state immediately
    setOnboardingState(prev => ({ ...prev, [field]: value }));
    return "confirmed";
  },
  requestGmailConnect: async () => {
    // Triggers Gmail connection card from within the call
    openGmailCard();
    return "gmail connection initiated";
  }
}
```

## Component Architecture

```
app/
├── page.tsx                    # Full-screen onboarding orchestrator
├── layout.tsx                  # Root layout, black body, Inter font loading
├── api/
│   └── gmail-verify/
│       └── route.ts            # Simulated Gmail OAuth
├── components/
│   ├── OnboardingFlow.tsx      # State machine + animated step transitions
│   ├── WelcomeStep.tsx         # Agent naming — centered input on black
│   ├── CallStep.tsx            # Incoming call + active call + ElevenLabs
│   ├── TextFallback.tsx        # Minimal chat for missing fields
│   ├── GmailCard.tsx           # Inline connection card
│   ├── GraduationStep.tsx      # Checkmark + summary + CTA
│   ├── Waveform.tsx            # Audio visualization bars
│   └── AnimatedCheckmark.tsx   # SVG stroke-draw animation
├── lib/
│   ├── onboarding-state.ts     # State machine logic
│   ├── animations.ts           # Shared motion constants (easing, durations)
│   └── types.ts                # TypeScript types
└── styles/
    └── globals.css             # Tailwind config + CSS custom properties
```

## Motion Constants

```typescript
const motion = {
  duration: { micro: 300, transition: 500, reveal: 800 },
  ease: {
    apple: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  stagger: 80,  // ms between sequential element reveals
};
```

## Font Substitution Note

SF Pro is Apple's proprietary system font. For cross-platform:
- Use `system-ui, -apple-system, BlinkMacSystemFont` as first stack entries — resolves to real SF Pro on Apple devices
- **Inter** (Google Fonts, variable) is the closest open-source fallback
- Nudge `letter-spacing` down by `-0.01em` on display sizes when using Inter — Inter's default tracking runs wider than SF Pro
- Tighten `line-height` by `0.03` for body text with Inter — Inter's taller x-height needs less leading

## Responsive Behavior

- **Desktop (≥1069px):** Content centered, max-width 680px, `{spacing.section}` (80px) vertical padding
- **Tablet (834–1068px):** Same layout, max-width 580px, 64px vertical padding
- **Phone (≤833px):** Full-width with 24px horizontal padding, 48px vertical padding
- Call buttons: same 64px size on mobile, positioned with `safe-area-inset-bottom`
- Text input: full-width on mobile, auto-focus with keyboard push
- Hero typography: 56px → 40px at ≤834px → 34px at ≤640px
- No layout shifts — everything is centered and flows vertically

## Do's and Don'ts

### Do
- Use `{colors.primary}` (Action Blue #0066cc) for every interactive element — links, pill CTAs, focus signals — and nothing else
- Set headlines in `{typography.hero-display}` with negative letter-spacing for the "Apple tight" cadence
- Run body copy at 17px, not 16px — the extra pixel defines the reading pace
- Use `transform: scale(0.95)` as the active/press state on every button
- Let the black canvas breathe — generous whitespace above and below every element
- Use surface-color changes (black ↔ tile-1) as section dividers, not borders

### Don't
- Don't introduce a second accent color
- Don't add shadows to cards, buttons, or text
- Don't use decorative gradients
- Don't set body copy at weight 500 — the ladder is 300 / 400 / 600
- Don't add visible borders to inputs or chat bubbles — depth comes from fill color
- Don't use typing indicator dots — the pause between messages is the indicator
- Don't show a send button — Enter key is the only submit mechanism
