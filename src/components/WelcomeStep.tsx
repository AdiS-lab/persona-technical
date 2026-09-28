"use client";

import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { ChatMessage } from "@/lib/types";

interface WelcomeStepProps {
  onAgentNamed: (name: string) => void;
}

const welcomeMessages: ChatMessage[] = [
  {
    id: "w1",
    role: "agent",
    content: "Hey! Welcome to Persona.",
    timestamp: Date.now(),
  },
  {
    id: "w2",
    role: "agent",
    content:
      "I'm going to be your personal AI assistant -- but first, I need a name. What would you like to call me?",
    timestamp: Date.now() + 100,
  },
];

export default function WelcomeStep({ onAgentNamed }: WelcomeStepProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reveal welcome messages with delay
  useEffect(() => {
    if (revealIndex >= welcomeMessages.length) return;
    const timer = setTimeout(
      () => {
        setMessages((prev) => [...prev, welcomeMessages[revealIndex]]);
        setRevealIndex((i) => i + 1);
      },
      revealIndex === 0 ? 500 : 1200
    );
    return () => clearTimeout(timer);
  }, [revealIndex]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (!pendingName && !confirmed) {
      // First response — treat as name
      const name = text.trim();
      setPendingName(name);
      setTimeout(() => {
        const confirmMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: "agent",
          content: `${name} -- I like that. Ready to get started?`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, confirmMsg]);
      }, 800);
    } else if (pendingName && !confirmed) {
      // Check if they're confirming or changing the name
      const lower = text.toLowerCase();
      if (
        lower.includes("yes") ||
        lower.includes("yeah") ||
        lower.includes("sure") ||
        lower.includes("ready") ||
        lower.includes("let's go") ||
        lower.includes("yep") ||
        lower.includes("ok")
      ) {
        setConfirmed(true);
        setTimeout(() => onAgentNamed(pendingName), 500);
      } else {
        // They're changing the name
        const newName = text.trim();
        setPendingName(newName);
        setTimeout(() => {
          const reconfirm: ChatMessage = {
            id: `a-${Date.now()}`,
            role: "agent",
            content: `${newName} it is. Sound good?`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, reconfirm]);
        }, 800);
      }
    }
  };

  const inputReady = revealIndex >= welcomeMessages.length;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} agentName="Persona" />
        ))}
        <div ref={bottomRef} />
      </div>
      {inputReady && !confirmed && (
        <ChatInput
          onSend={handleSend}
          placeholder={pendingName ? "Yes / pick a different name" : "Give me a name..."}
        />
      )}
    </div>
  );
}
