"use client";

import { useState } from "react";

interface GmailConnectProps {
  onConnect: (email: string) => void;
  onDecline: () => void;
  suggestedEmail?: string | null;
}

export default function GmailConnect({
  onConnect,
  onDecline,
  suggestedEmail,
}: GmailConnectProps) {
  const [email, setEmail] = useState(suggestedEmail || "");
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "skipped">("idle");

  const handleConnect = async () => {
    if (!email.includes("@")) return;
    setStatus("connecting");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("connected");
    onConnect(email);
  };

  if (status === "connected") {
    return (
      <div className="my-3 animate-fade-in-up" style={{ animationTimingFunction: "var(--ease-spring)" }}>
        <div
          className="rounded-[18px] p-6 flex items-center gap-3"
          style={{
            backgroundColor: "var(--surface-tile-1)",
            border: "1px solid var(--divider)",
          }}
        >
          <div className="w-10 h-10 rounded-[11px] flex items-center justify-center" style={{ backgroundColor: "rgba(48, 209, 88, 0.1)" }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="var(--success)">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]" style={{ color: "var(--success)" }}>Connected</p>
            <p className="text-[14px] leading-[1.43] tracking-[-0.224px]" style={{ color: "var(--body-muted)" }}>{email}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "skipped") {
    return (
      <div className="my-3 opacity-50 animate-fade-in-up">
        <div
          className="rounded-[18px] p-6 flex items-center gap-3"
          style={{
            backgroundColor: "var(--surface-tile-1)",
            border: "1px solid var(--divider)",
          }}
        >
          <div className="w-10 h-10 rounded-[11px] flex items-center justify-center" style={{ backgroundColor: "var(--surface-tile-2)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="var(--ink-muted-48)">
              <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <p className="text-[14px] leading-[1.43] tracking-[-0.224px]" style={{ color: "var(--ink-muted-48)" }}>Skipped</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 animate-fade-in-up">
      <div
        className="rounded-[18px] p-6"
        style={{
          backgroundColor: "var(--surface-tile-1)",
          border: "1px solid var(--divider)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[11px] flex items-center justify-center" style={{ backgroundColor: "rgba(234, 67, 53, 0.1)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="var(--gmail-red)">
              <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px]" style={{ color: "var(--on-dark)" }}>
              Connect your Gmail
            </p>
            <p className="text-[14px] leading-[1.43] tracking-[-0.224px]" style={{ color: "var(--body-muted)" }}>
              So I can help manage your email
            </p>
          </div>
        </div>

        {/* Email input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="w-full rounded-[11px] px-4 py-3 text-[17px] leading-[1.47] tracking-[-0.374px] outline-none mb-5"
          style={{
            backgroundColor: "var(--surface-tile-2)",
            color: "var(--on-dark)",
            border: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConnect();
          }}
        />

        {/* Connect button — pill */}
        <button
          onClick={handleConnect}
          disabled={!email.includes("@") || status === "connecting"}
          className="w-full py-3 rounded-full text-[17px] leading-[1.47] tracking-[-0.374px] press-scale transition-all disabled:opacity-30"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--on-primary)",
          }}
        >
          {status === "connecting" ? (
            <span
              className="inline-block w-4 h-4 rounded-full animate-spin-slow"
              style={{ border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "var(--on-primary)" }}
            />
          ) : (
            "Connect"
          )}
        </button>

        {/* Skip */}
        <button
          onClick={() => {
            setStatus("skipped");
            onDecline();
          }}
          className="w-full mt-3 text-[14px] leading-[1.43] tracking-[-0.224px] transition-colors"
          style={{ color: "var(--ink-muted-48)" }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
