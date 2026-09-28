import { OnboardingState, OnboardingStep } from "./types";

export function getMissingFields(state: OnboardingState): string[] {
  const missing: string[] = [];
  if (!state.userName) missing.push("userName");
  if (!state.gmail && !state.gmailDeclined) missing.push("gmail");
  if (!state.userNeed) missing.push("userNeed");
  return missing;
}

export function isOnboardingComplete(state: OnboardingState): boolean {
  return (
    !!state.agentName &&
    !!state.userName &&
    (!!state.gmailConnected || state.gmailDeclined) &&
    !!state.userNeed
  );
}

export function canGraduateEarly(state: OnboardingState): boolean {
  // User can graduate early if they have a name and a clear need
  return !!state.agentName && !!state.userName && !!state.userNeed;
}

export function getCurrentStep(state: OnboardingState): OnboardingStep {
  if (!state.agentName) return "welcome";
  if (state.graduated) return "graduation";

  if (isOnboardingComplete(state)) return "graduation";

  // If call hasn't happened yet and wasn't declined
  if (
    state.callStatus === "pending" &&
    !state.callDeclined
  ) {
    return "call";
  }

  // If call is active, stay on call
  if (state.callStatus === "ringing" || state.callStatus === "active") {
    return "call";
  }

  // After call ended or declined, check what's missing
  const missing = getMissingFields(state);

  if (missing.length > 0) {
    // Need Gmail connection specifically
    if (
      missing.length === 1 &&
      missing[0] === "gmail" &&
      !state.gmailConnected
    ) {
      return "gmail";
    }
    return "text-fallback";
  }

  return "graduation";
}

export function getNextPrompt(state: OnboardingState): string | null {
  const missing = getMissingFields(state);
  if (missing.length === 0) return null;

  const field = missing[0];
  switch (field) {
    case "userName":
      return "What should I call you?";
    case "gmail":
      return "Want to connect your Gmail so I can help with your email?";
    case "userNeed":
      return "What's something you could use help with right now?";
    default:
      return null;
  }
}
