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
      showLink: !state.gmailConnected,
    },
    { label: "First task", value: state.userNeed },
  ].filter((item) => item.value);

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-6"
      style={{ backgroundColor: "var(--surface-black)" }}
    >
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
          stroke="var(--primary-on-dark)"
          strokeWidth="1.5"
          opacity="0.15"
        />
        <path
          d="M14 24 L21 31 L34 18"
          stroke="var(--primary-on-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-check"
          style={{ animationDelay: "300ms" }}
        />
      </svg>

      {/* Title */}
      <h2
        className="hero-display animate-fade-in"
        style={{
          fontSize: "56px",
          fontWeight: 600,
          lineHeight: 1.07,
          letterSpacing: "-0.28px",
          color: "var(--on-dark)",
          animationDelay: "500ms",
        }}
      >
        You&apos;re all set.
      </h2>

      {/* Summary */}
      <div className="w-full max-w-[400px] mt-12">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center justify-between py-4 animate-fade-in-up stagger-${i + 1}`}
            style={{ borderBottom: "1px solid var(--divider)" }}
          >
            <span
              className="text-[14px] leading-[1.43] tracking-[-0.224px]"
              style={{ color: "var(--body-muted)" }}
            >
              {item.label}
            </span>
            <span
              className="text-[17px] leading-[1.47] tracking-[-0.374px] max-w-[240px] truncate"
              style={{ color: item.dim ? "var(--ink-muted-48)" : "var(--on-dark)" }}
            >
              {item.value}
              {item.showLink && (
                <button
                  className="ml-2 text-[14px]"
                  style={{ color: "var(--primary-on-dark)" }}
                >
                  Connect
                </button>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className="w-full max-w-[400px] mt-12 py-4 rounded-full text-[17px] leading-[1.47] tracking-[-0.374px] press-scale transition-transform animate-fade-in-up"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--on-primary)",
          animationDelay: "600ms",
          boxShadow: "0 4px 24px rgba(0, 102, 204, 0.3)",
        }}
      >
        Get Started
      </button>
    </div>
  );
}
