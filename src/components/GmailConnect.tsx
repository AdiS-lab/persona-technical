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
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (!email.includes("@")) return;
    setConnecting(true);
    // Simulate OAuth delay
    await new Promise((r) => setTimeout(r, 1500));
    setConnected(true);
    setConnecting(false);
    onConnect(email);
  };

  if (connected) {
    return (
      <div className="mx-4 my-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Connected to {email}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 my-3 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 18h-2V9.25L12 13 6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Connect Gmail
          </h3>
          <p className="text-xs text-zinc-500">
            So I can help with your email
          </p>
        </div>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@gmail.com"
        className="w-full bg-zinc-50 dark:bg-zinc-900 rounded-lg px-3 py-2 text-sm outline-none border border-zinc-200 dark:border-zinc-700 mb-3 text-zinc-900 dark:text-zinc-100"
      />
      <div className="flex gap-2">
        <button
          onClick={handleConnect}
          disabled={!email.includes("@") || connecting}
          className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {connecting ? "Connecting..." : "Connect"}
        </button>
        <button
          onClick={onDecline}
          className="px-4 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
