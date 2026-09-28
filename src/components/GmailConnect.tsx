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
      <div className="my-3 animate-fade-in-up">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[17px] text-[var(--success)] font-medium">Connected</p>
            <p className="text-[13px] text-[var(--text-secondary)]">{email}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "skipped") {
    return (
      <div className="my-3 opacity-50 animate-fade-in-up">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--text-tertiary)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <p className="text-[13px] text-[var(--text-tertiary)]">Skipped</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 animate-fade-in-up">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--gmail-red)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--gmail-red)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-[17px] text-white font-medium">Connect your Gmail</p>
            <p className="text-[13px] text-[var(--text-secondary)]">So I can help manage your email</p>
          </div>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@gmail.com"
          className="w-full bg-[var(--surface)] rounded-xl px-4 py-3 text-[17px] text-white placeholder:text-[var(--text-tertiary)] outline-none border border-[var(--divider)] mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConnect();
          }}
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleConnect}
            disabled={!email.includes("@") || status === "connecting"}
            className="flex-1 bg-[var(--accent)] text-white text-[17px] font-semibold py-3 rounded-xl hover:bg-[var(--accent-hover)] disabled:opacity-30 transition-colors"
          >
            {status === "connecting" ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            ) : (
              "Connect"
            )}
          </button>
        </div>
        <button
          onClick={() => {
            setStatus("skipped");
            onDecline();
          }}
          className="w-full mt-3 text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
