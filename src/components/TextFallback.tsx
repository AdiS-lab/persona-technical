"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GmailConnect from "./GmailConnect";
import { ChatMessage, OnboardingState } from "@/lib/types";
import { getMissingFields } from "@/lib/onboarding-state";

interface TextFallbackProps {
  agentName: string;
  state: OnboardingState;
  onStateUpdate: (updates: Partial<OnboardingState>) => void;
  afterCall: boolean;
}

export default function TextFallback({
  agentName,
  state,
  onStateUpdate,
  afterCall,
}: TextFallbackProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showGmail, setShowGmail] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showGmail]);

  const addAgentMessage = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: `a-${Date.now()}-${Math.random()}`,
      role: "agent",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const askNext = useCallback(
    (currentState: OnboardingState) => {
      const missing = getMissingFields(currentState);
      if (missing.length === 0) {
        setTimeout(() => {
          addAgentMessage(
            "That's everything I need. Let me get things set up for you."
          );
          setTimeout(() => onStateUpdate({ graduated: true }), 1500);
        }, 800);
        return;
      }

      const next = missing[0];
      setCurrentField(next);

      setTimeout(() => {
        switch (next) {
          case "userName":
            addAgentMessage("What should I call you?");
            break;
          case "gmail":
            addAgentMessage(
              "Want to connect your Gmail? It'll let me help with your email."
            );
            setShowGmail(true);
            break;
          case "userNeed":
            addAgentMessage(
              "What's something you could use a hand with? Could be anything -- email, scheduling, research, writing..."
            );
            break;
        }
      }, 800);
    },
    [addAgentMessage, onStateUpdate]
  );

  // Initial message
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (afterCall) {
      const missing = getMissingFields(state);
      if (missing.length > 0) {
        addAgentMessage(
          state.callStatus === "declined"
            ? "No worries, we can do this over text instead. Just as easy."
            : "Looks like we got cut off. Let's pick up where we left off."
        );
      }
    }

    setTimeout(() => askNext(state), afterCall ? 1500 : 500);
  }, [afterCall, state, addAgentMessage, askNext]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (currentField === "userName") {
      const name = text.trim();
      const newState = { ...state, userName: name };
      onStateUpdate({ userName: name });
      setTimeout(() => {
        addAgentMessage(`Nice to meet you, ${name}.`);
        setTimeout(() => askNext(newState), 1000);
      }, 600);
    } else if (currentField === "userNeed") {
      const need = text.trim();
      const newState = { ...state, userNeed: need };
      onStateUpdate({ userNeed: need });
      setTimeout(() => {
        addAgentMessage(
          "Got it. That's exactly the kind of thing I can help with."
        );
        setTimeout(() => askNext(newState), 1000);
      }, 600);
    } else if (currentField === "gmail") {
      // They typed instead of using the card
      const lower = text.toLowerCase();
      if (
        lower.includes("no") ||
        lower.includes("skip") ||
        lower.includes("later")
      ) {
        setShowGmail(false);
        const newState = { ...state, gmailDeclined: true };
        onStateUpdate({ gmailDeclined: true });
        setTimeout(() => {
          addAgentMessage("No problem, you can always connect it later.");
          setTimeout(() => askNext(newState), 1000);
        }, 600);
      } else if (text.includes("@")) {
        // They typed an email
        setShowGmail(false);
        const newState = { ...state, gmail: text.trim(), gmailConnected: true };
        onStateUpdate({ gmail: text.trim(), gmailConnected: true });
        setTimeout(() => {
          addAgentMessage(`Connected to ${text.trim()}.`);
          setTimeout(() => askNext(newState), 1000);
        }, 600);
      } else {
        addAgentMessage(
          "You can type your email, use the card above, or say skip."
        );
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} agentName={agentName} />
        ))}
        {showGmail && (
          <GmailConnect
            suggestedEmail={state.gmail}
            onConnect={(email) => {
              setShowGmail(false);
              const newState = {
                ...state,
                gmail: email,
                gmailConnected: true,
              };
              onStateUpdate({ gmail: email, gmailConnected: true });
              setTimeout(() => askNext(newState), 1000);
            }}
            onDecline={() => {
              setShowGmail(false);
              const newState = { ...state, gmailDeclined: true };
              onStateUpdate({ gmailDeclined: true });
              addAgentMessage("No problem, you can always connect it later.");
              setTimeout(() => askNext(newState), 1000);
            }}
          />
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} placeholder="Type a message..." />
    </div>
  );
}
