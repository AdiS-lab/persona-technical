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
  const [callDuration, setCallDuration] = useState(0);
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

  // Call duration timer
  useEffect(() => {
    if (state.callStatus !== "active") return;
    const interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [state.callStatus]);

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
            if (
              field === "userName" ||
              field === "gmail" ||
              field === "userNeed"
            ) {
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
    onStateUpdate({ callStatus: "ended" });
    onCallEnd();
  }, [conversation, onStateUpdate, onCallEnd]);

  const declineCall = useCallback(() => {
    onStateUpdate({ callStatus: "declined", callDeclined: true });
    onCallDecline();
  }, [onStateUpdate, onCallDecline]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Incoming call screen
  if (state.callStatus === "pending") {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-8 p-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-semibold animate-pulse">
          {agentName.charAt(0).toUpperCase()}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {agentName}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">wants to say hello</p>
        </div>
        <div className="flex gap-6">
          <button
            onClick={declineCall}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
            aria-label="Decline call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-[135deg]">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={acceptCall}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
            aria-label="Accept call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-zinc-400 mt-2">
          or <button onClick={declineCall} className="underline hover:text-zinc-600">continue by text</button>
        </p>
      </div>
    );
  }

  // Active call screen
  if (state.callStatus === "active" || state.callStatus === "ringing") {
    const isConnecting = state.callStatus === "ringing";
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8 bg-gradient-to-b from-zinc-900 to-black text-white">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl font-semibold">
          {agentName.charAt(0).toUpperCase()}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{agentName}</h2>
          <p className="text-sm text-zinc-400 mt-1">
            {isConnecting ? "connecting..." : formatDuration(callDuration)}
          </p>
        </div>

        {/* Voice activity indicator */}
        {!isConnecting && (
          <div className="flex items-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-blue-400 transition-all duration-150 ${
                  conversation.isSpeaking
                    ? "animate-pulse"
                    : "h-1"
                }`}
                style={{
                  height: conversation.isSpeaking
                    ? `${12 + Math.random() * 20}px`
                    : "4px",
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-zinc-500">
          {isConnecting
            ? "Setting up your call..."
            : conversation.isSpeaking
            ? `${agentName} is speaking...`
            : "Listening..."}
        </p>

        <button
          onClick={hangUp}
          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors mt-4"
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
