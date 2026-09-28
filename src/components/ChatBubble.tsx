"use client";

import { ChatMessage } from "@/lib/types";

interface ChatBubbleProps {
  message: ChatMessage;
  agentName?: string;
}

export default function ChatBubble({ message, agentName }: ChatBubbleProps) {
  const isAgent = message.role === "agent";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 animate-fade-in-up">
        <span className="text-[13px] text-[var(--text-tertiary)]">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-3 animate-fade-in-up`}
    >
      <div className={`max-w-[85%] flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
        {isAgent && agentName && (
          <span className="text-[13px] text-[var(--text-secondary)] mb-1 ml-1">
            {agentName}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-[17px] leading-relaxed tracking-[-0.01em] ${
            isAgent
              ? "bg-[var(--surface-elevated)] text-white rounded-bl-md"
              : "bg-[var(--accent)] text-white rounded-br-md"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
