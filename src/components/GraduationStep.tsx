"use client";

import { OnboardingState } from "@/lib/types";

interface GraduationStepProps {
  state: OnboardingState;
}

export default function GraduationStep({ state }: GraduationStepProps) {
  const items = [
    { label: "Agent", value: state.agentName },
    { label: "You", value: state.userName },
    {
      label: "Gmail",
      value: state.gmailConnected ? state.gmail : "Not connected",
      dim: !state.gmailConnected,
    },
    { label: "First task", value: state.userNeed },
  ].filter((item) => item.value);

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6">
      {/* Animated checkmark */}
      <svg
        className="w-16 h-16 mb-8 animate-fade-in"
        viewBox="0 0 48 48"
        fill="none"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="var(--accent)"
          strokeWidth="2"
          opacity="0.2"
        />
        <path
          d="M14 24 L21 31 L34 18"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-check"
          style={{ animationDelay: "300ms" }}
        />
      </svg>

      {/* Title */}
      <h2
        className="text-[48px] font-bold tracking-[-0.02em] text-white mb-2 animate-fade-in"
        style={{ animationDelay: "500ms" }}
      >
        You&apos;re all set.
      </h2>

      {/* Summary */}
      <div className="w-full max-w-sm mt-10 space-y-0">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center justify-between py-4 border-b border-[var(--divider)] animate-fade-in-up stagger-${i + 1}`}
          >
            <span className="text-[13px] text-[var(--text-secondary)]">
              {item.label}
            </span>
            <span
              className={`text-[17px] tracking-[-0.01em] max-w-[220px] truncate ${
                item.dim
                  ? "text-[var(--text-tertiary)]"
                  : "text-white"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full max-w-sm mt-12 py-4 bg-[var(--accent)] text-white text-[17px] font-semibold rounded-xl transition-colors hover:bg-[var(--accent-hover)] animate-fade-in-up"
        style={{
          animationDelay: "600ms",
          boxShadow: "0 4px 24px rgba(10, 132, 255, 0.3)",
        }}
      >
        Get Started
      </button>
    </div>
  );
}
