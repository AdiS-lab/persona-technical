export interface OnboardingState {
  agentName: string | null;
  userName: string | null;
  gmail: string | null;
  gmailConnected: boolean;
  userNeed: string | null;
  callStatus: "pending" | "ringing" | "active" | "ended" | "declined";
  callDeclined: boolean;
  gmailDeclined: boolean;
  graduated: boolean;
}

export interface ChatMessage {
  id: string;
  role: "agent" | "user" | "system";
  content: string;
  timestamp: number;
}

export type OnboardingStep =
  | "welcome"
  | "call"
  | "text-fallback"
  | "gmail"
  | "graduation";

export const initialOnboardingState: OnboardingState = {
  agentName: null,
  userName: null,
  gmail: null,
  gmailConnected: false,
  userNeed: null,
  callStatus: "pending",
  callDeclined: false,
  gmailDeclined: false,
  graduated: false,
};
