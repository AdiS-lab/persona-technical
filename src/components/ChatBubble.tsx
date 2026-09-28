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
      <div className="flex justify-center my-2">
        <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-500 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-3`}
    >
      <div className={`max-w-[80%] flex flex-col ${isAgent ? "items-start" : "items-end"}`}>
        {isAgent && agentName && (
          <span className="text-xs text-zinc-400 mb-1 ml-1">{agentName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isAgent
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md"
              : "bg-blue-600 text-white rounded-br-md"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
