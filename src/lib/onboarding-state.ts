import { OnboardingState } from "./types";

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
