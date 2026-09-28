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
      <div className="flex justify-center my-4 animate-fade-in-up">
        <span
          className="text-[14px] leading-[1.43] tracking-[-0.224px]"
          style={{ color: "var(--ink-muted-48)" }}
        >
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
          <span
            className="text-[14px] leading-[1.43] tracking-[-0.224px] mb-1 ml-1"
            style={{ color: "var(--body-muted)" }}
          >
            {agentName}
          </span>
        )}
        <div
          className="px-4 py-3 rounded-[18px] text-[17px] leading-[1.47] tracking-[-0.374px]"
          style={{
            backgroundColor: isAgent ? "var(--surface-tile-1)" : "var(--primary)",
            color: isAgent ? "var(--on-dark)" : "var(--on-primary)",
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
