"use client";

import { useState, useCallback } from "react";
import { OnboardingState, initialOnboardingState } from "@/lib/types";
import { getCurrentStep } from "@/lib/onboarding-state";
import WelcomeStep from "./WelcomeStep";
import CallUI from "./CallUI";
import TextFallback from "./TextFallback";
import GraduationStep from "./GraduationStep";

export default function OnboardingFlow() {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [afterCall, setAfterCall] = useState(false);

  const handleStateUpdate = useCallback(
    (updates: Partial<OnboardingState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleAgentNamed = useCallback(
    (name: string) => {
      handleStateUpdate({ agentName: name });
    },
    [handleStateUpdate]
  );

  const handleCallEnd = useCallback(() => {
    setAfterCall(true);
  }, []);

  const handleCallDecline = useCallback(() => {
    setAfterCall(true);
    handleStateUpdate({ callStatus: "declined", callDeclined: true });
  }, [handleStateUpdate]);

  const step = getCurrentStep(state);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold">
            {state.agentName?.charAt(0).toUpperCase() || "P"}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {state.agentName || "Persona"}
            </h1>
            <p className="text-[11px] text-zinc-400">
              {step === "graduation"
                ? "Ready"
                : step === "call" && state.callStatus === "active"
                ? "On a call"
                : "Setting up"}
            </p>
          </div>
        </div>
        {/* Stage indicators */}
        <div className="flex gap-1">
          {["agentName", "userName", "gmail", "userNeed"].map((field) => (
            <div
              key={field}
              className={`w-2 h-2 rounded-full transition-colors ${
                state[field as keyof OnboardingState]
                  ? "bg-blue-500"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {step === "welcome" && (
          <WelcomeStep onAgentNamed={handleAgentNamed} />
        )}
        {step === "call" && state.agentName && (
          <CallUI
            agentName={state.agentName}
            state={state}
            onStateUpdate={handleStateUpdate}
            onCallEnd={handleCallEnd}
            onCallDecline={handleCallDecline}
          />
        )}
        {(step === "text-fallback" || step === "gmail") && state.agentName && (
          <TextFallback
            agentName={state.agentName}
            state={state}
            onStateUpdate={handleStateUpdate}
            afterCall={afterCall}
          />
        )}
        {step === "graduation" && <GraduationStep state={state} />}
      </div>
    </div>
  );
}
