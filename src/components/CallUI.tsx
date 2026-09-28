"use client";

import { useCallback, useState, useEffect, useRef } from "react";
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
  const sessionStarted = useRef(false);
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const conversation = useConversation({
    onConnect: () => {
      console.log("[ElevenLabs] Connected");
      onStateUpdate({ callStatus: "active" });
    },
    onDisconnect: () => {
      console.log("[ElevenLabs] Disconnected, sessionStarted:", sessionStarted.current);
      // Only trigger end if we actually had a session going
      if (sessionStarted.current) {
        sessionStarted.current = false;
        onStateUpdate({ callStatus: "ended" });
        onCallEnd();
      }
    },
    onError: (error) => {
      console.error("[ElevenLabs] Error:", error);
      if (sessionStarted.current) {
        sessionStarted.current = false;
        onStateUpdate({ callStatus: "ended" });
        onCallEnd();
      }
    },
  });

  // Waveform animation
  useEffect(() => {
    if (state.callStatus !== "active") return;
    const interval = setInterval(() => {
      if (conversation.isSpeaking) {
        setBarHeights(Array.from({ length: 5 }, () => 8 + Math.random() * 40));
      } else {
        setBarHeights(Array.from({ length: 5 }, () => 3 + Math.random() * 3));
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
      sessionStarted.current = true;
      console.log("[ElevenLabs] Starting session with agent:", agentId);
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
      console.log("[ElevenLabs] Session started successfully");
    } catch (error) {
      console.error("[ElevenLabs] Failed to start call:", error);
      sessionStarted.current = false;
      onStateUpdate({ callStatus: "ended" });
      onCallEnd();
    }
  }, [agentId, conversation, onStateUpdate, onCallEnd, onCallDecline]);

  const hangUp = useCallback(async () => {
    console.log("[ElevenLabs] Hanging up");
    await conversation.endSession();
  }, [conversation]);

  // === INCOMING CALL ===
  if (state.callStatus === "pending") {
    return (
      <div
        className="flex flex-col items-center justify-center flex-1 relative animate-fade-in"
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #5856d6 100%)",
          }}
        >
          <span
            className="text-[40px] font-semibold leading-[1.1]"
            style={{ color: "var(--on-dark)" }}
          >
            {agentName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name */}
        <h2
          className="mt-2 text-[21px] font-semibold leading-[1.19] tracking-[0.231px]"
          style={{ color: "var(--on-dark)" }}
        >
          {agentName}
        </h2>

        {/* Status */}
        <p
          className="mt-1 text-[14px] leading-[1.43] tracking-[-0.224px] animate-calling-pulse"
          style={{ color: "var(--body-muted)" }}
        >
          is calling...
        </p>

        {/* Buttons — bottom positioned */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-[120px]">
          <button
            onClick={onCallDecline}
            className="w-16 h-16 rounded-full flex items-center justify-center press-scale transition-transform"
            style={{
              backgroundColor: "var(--destructive)",
              boxShadow: "0 0 30px rgba(255, 69, 58, 0.3)",
            }}
            aria-label="Decline call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--on-dark)" className="w-7 h-7 rotate-[135deg]">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={acceptCall}
            className="w-16 h-16 rounded-full flex items-center justify-center press-scale transition-transform animate-pulse-scale"
            style={{
              backgroundColor: "var(--success)",
              boxShadow: "0 0 30px rgba(48, 209, 88, 0.3)",
            }}
            aria-label="Accept call"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--on-dark)" className="w-7 h-7">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // === ACTIVE / CONNECTING ===
  if (state.callStatus === "active" || state.callStatus === "ringing") {
    const isConnecting = state.callStatus === "ringing";
    return (
      <div
        className="flex flex-col items-center justify-center flex-1 relative animate-fade-in"
        style={{ backgroundColor: "var(--surface-black)" }}
      >
        {/* Agent name */}
        <p
          className="text-[14px] leading-[1.43] tracking-[-0.224px] mb-10"
          style={{ color: "var(--body-muted)" }}
        >
          {agentName}
        </p>

        {/* Waveform */}
        <div className="flex items-center gap-[6px] h-12 mb-4">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: "4px",
                height: isConnecting ? "4px" : `${h}px`,
                backgroundColor: "var(--primary-on-dark)",
                transition: "height 150ms ease",
              }}
            />
          ))}
        </div>

        {/* Status */}
        <p
          className="text-[12px] leading-[1] tracking-[-0.12px]"
          style={{ color: "var(--ink-muted-48)" }}
        >
          {isConnecting
            ? "Connecting..."
            : conversation.isSpeaking
            ? "Speaking..."
            : "Listening..."}
        </p>

        {/* End call */}
        <button
          onClick={hangUp}
          className="absolute bottom-12 w-14 h-14 rounded-full flex items-center justify-center press-scale transition-transform"
          style={{ backgroundColor: "var(--destructive)" }}
          aria-label="End call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--on-dark)" className="w-6 h-6 rotate-[135deg]">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return null;
}
