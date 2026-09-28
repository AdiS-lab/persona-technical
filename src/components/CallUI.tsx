"use client";

import { useCallback, useState, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { OnboardingState } from "@/lib/types";

interface CallUIProps {
  agentName: string;
  state: OnboardingState;
  onStateUpdate: (updates: Partial<OnboardingState>) => void;
  onCallEnd: () => void;
  onCallDecline: () => void;
}

export default function CallUI({
  agentName,
  state,
  onStateUpdate,
  onCallEnd,
  onCallDecline,
}: CallUIProps) {
  const [barHeights, setBarHeights] = useState([4, 4, 4, 4, 4]);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const conversation = useConversation({
    onConnect: () => {
      onStateUpdate({ callStatus: "active" });
    },
    onDisconnect: () => {
      onStateUpdate({ callStatus: "ended" });
      onCallEnd();
    },
    onError: (error) => {
      console.error("Call error:", error);
      onStateUpdate({ callStatus: "ended" });
      onCallEnd();
    },
  });

  // Waveform animation
  useEffect(() => {
    if (state.callStatus !== "active") return;
    const interval = setInterval(() => {
      if (conversation.isSpeaking) {
        setBarHeights(Array.from({ length: 5 }, () => 8 + Math.random() * 40));
      } else {
        setBarHeights((prev) =>
          prev.map(() => 3 + Math.random() * 3)
        );
      }
    }, 150);
    return () => clearInterval(interval);
  }, [state.callStatus, conversation.isSpeaking]);

  const acceptCall = useCallback(async () => {
    if (!agentId) {
      console.error("No ElevenLabs agent ID configured");
      onCallDecline();
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.error("Microphone access denied");
      onCallDecline();
      return;
    }

    try {
      onStateUpdate({ callStatus: "ringing" });
      await conversation.startSession({
        agentId,
        clientTools: {
          updateStage: async (params: Record<string, string>) => {
            const { field, value } = params;
            if (field === "userName" || field === "gmail" || field === "userNeed") {
              onStateUpdate({ [field]: value });
            }
            return "confirmed";
          },
          requestGmailConnect: async () => {
            onStateUpdate({ gmail: "pending" });
            return "Gmail connection card will be shown to the user";
          },
        },
      });
    } catch (error) {
      console.error("Failed to start call:", error);
      onStateUpdate({ callStatus: "ended" });
      onCallEnd();
    }
  }, [agentId, conversation, onStateUpdate, onCallEnd, onCallDecline]);

  const hangUp = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Incoming call screen
  if (state.callStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 animate-fade-in">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-3xl font-semibold mb-6">
          {agentName.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-white mb-2">
          {agentName}
        </h2>
        <p className="text-[17px] text-[var(--text-secondary)] animate-calling-pulse">
          is calling...
        </p>

        {/* Call buttons */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-[120px]">
          <button
            onClick={onCallDecline}
            className="w-16 h-16 rounded-full bg-[var(--destructive)] flex items-center justify-center text-white transition-transform active:scale-95"
            style={{ boxShadow: "0 0 30px rgba(255, 69, 58, 0.4)" }}
            aria-label="Decline call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 rotate-[135deg]">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={acceptCall}
            className="w-16 h-16 rounded-full bg-[var(--success)] flex items-center justify-center text-white transition-transform active:scale-95 animate-pulse-glow"
            style={{ boxShadow: "0 0 30px rgba(48, 209, 88, 0.4)" }}
            aria-label="Accept call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Active call / connecting
  if (state.callStatus === "active" || state.callStatus === "ringing") {
    const isConnecting = state.callStatus === "ringing";
    return (
      <div className="flex flex-col items-center justify-center flex-1 animate-fade-in">
        {/* Agent name */}
        <p className="text-[13px] text-[var(--text-secondary)] mb-8">
          {agentName}
        </p>

        {/* Waveform */}
        <div className="flex items-center gap-1.5 h-12 mb-4">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-[var(--accent)]"
              style={{
                height: isConnecting ? "4px" : `${h}px`,
                transition: "height 150ms ease",
              }}
            />
          ))}
        </div>

        {/* Status */}
        <p className="text-[13px] text-[var(--text-tertiary)]">
          {isConnecting
            ? "Connecting..."
            : conversation.isSpeaking
            ? "Speaking..."
            : "Listening..."}
        </p>

        {/* End call */}
        <button
          onClick={hangUp}
          className="absolute bottom-12 w-14 h-14 rounded-full bg-[var(--destructive)] flex items-center justify-center text-white transition-transform active:scale-95"
          aria-label="End call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-[135deg]">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return null;
}
