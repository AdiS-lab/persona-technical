"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  OnboardingState,
  ChatMessage,
  initialOnboardingState,
} from "@/lib/types";
import { getMissingFields, isOnboardingComplete } from "@/lib/onboarding-state";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GmailConnect from "./GmailConnect";
import CallUI from "./CallUI";
import GraduationStep from "./GraduationStep";

type Phase = "naming" | "calling" | "text-collect" | "done";

export default function OnboardingFlow() {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("naming");
  const [showGmail, setShowGmail] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showGmail, phase]);

  // Welcome sequence
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setTimeout(() => setInputVisible(true), 1200);
  }, []);

  const addAgentMsg = useCallback((content: string, delay = 0) => {
    const add = () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          role: "agent",
          content,
          timestamp: Date.now(),
        },
      ]);
    };
    if (delay) setTimeout(add, delay);
    else add();
  }, []);

  const addUserMsg = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: "user",
        content,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const addSystemMsg = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        role: "system",
        content,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Ask next missing field
  const askNextField = useCallback(
    (currentState: OnboardingState) => {
      const missing = getMissingFields(currentState);
      if (missing.length === 0 || isOnboardingComplete(currentState)) {
        addAgentMsg(
          "That's everything I need. Let me get things set up for you."
        );
        setTimeout(() => {
          setState((prev) => ({ ...prev, graduated: true }));
          setPhase("done");
        }, 1500);
        return;
      }

      const next = missing[0];
      setCurrentField(next);

      switch (next) {
        case "userName":
          addAgentMsg("By the way, what should I call you?", 800);
          break;
        case "gmail":
          addAgentMsg(
            "Want to connect your Gmail? It'll let me help with your email.",
            800
          );
          setTimeout(() => setShowGmail(true), 1200);
          break;
        case "userNeed":
          addAgentMsg(
            "What's something you could use a hand with? Could be anything -- email, scheduling, research, writing...",
            800
          );
          break;
      }
    },
    [addAgentMsg]
  );

  // After call ends
  const handleCallEnd = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, callStatus: "ended" as const };
      const missing = getMissingFields(next);
      if (missing.length === 0 || isOnboardingComplete(next)) {
        addAgentMsg("Great talking to you! Let me get everything set up.");
        setTimeout(() => {
          setState((p) => ({ ...p, graduated: true }));
          setPhase("done");
        }, 1500);
      } else {
        addSystemMsg("Call ended");
        addAgentMsg(
          "Looks like we got cut off -- no worries, let's finish up here.",
          600
        );
        setPhase("text-collect");
        setTimeout(() => askNextField(next), 2000);
      }
      return next;
    });
  }, [addAgentMsg, addSystemMsg, askNextField]);

  const handleCallDecline = useCallback(() => {
    setState((prev) => {
      const next = {
        ...prev,
        callStatus: "declined" as const,
        callDeclined: true,
      };
      addAgentMsg(
        "No problem at all! We can do this over text. Just as easy.",
        400
      );
      setPhase("text-collect");
      setTimeout(() => askNextField(next), 1500);
      return next;
    });
  }, [addAgentMsg, askNextField]);

  // Handle input
  const handleSend = (text: string) => {
    addUserMsg(text);
    const lower = text.toLowerCase().trim();

    if (phase === "naming") {
      handleNaming(text, lower);
      return;
    }

    if (phase === "text-collect") {
      handleTextCollect(text, lower);
      return;
    }
  };

  const handleNaming = (text: string, lower: string) => {
    if (!pendingName && !nameConfirmed) {
      const name = text.trim();
      setPendingName(name);
      addAgentMsg(`${name} -- I like that. Sound good?`, 800);
    } else if (pendingName && !nameConfirmed) {
      if (isAffirmative(lower)) {
        setNameConfirmed(true);
        const name = pendingName;
        updateState({ agentName: name, callStatus: "pending" });
        addAgentMsg(`Perfect. I'm ${name}.`, 600);
        // Transition to call after a beat
        setTimeout(() => setPhase("calling"), 2000);
      } else {
        const newName = text.trim();
        setPendingName(newName);
        addAgentMsg(`${newName} it is. Sound good?`, 800);
      }
    }
  };

  const handleTextCollect = (text: string, lower: string) => {
    // Rename support
    if (
      lower.includes("rename") ||
      lower.includes("change your name") ||
      lower.includes("change the name")
    ) {
      addAgentMsg("Sure! What would you like to call me instead?", 600);
      setCurrentField("renameAgent");
      return;
    }

    if (currentField === "renameAgent") {
      const newName = text.trim();
      updateState({ agentName: newName });
      addAgentMsg(`Done -- I'm ${newName} now.`, 600);
      setState((prev) => {
        setTimeout(() => askNextField(prev), 1000);
        return prev;
      });
      return;
    }

    if (currentField === "userName") {
      const name = text.trim();
      const newState = { ...state, userName: name };
      updateState({ userName: name });
      addAgentMsg(`Nice to meet you, ${name}.`, 600);
      setTimeout(() => askNextField(newState), 1200);
    } else if (currentField === "userNeed") {
      const need = text.trim();
      const newState = { ...state, userNeed: need };
      updateState({ userNeed: need });
      addAgentMsg(
        "Got it -- that's exactly the kind of thing I can help with.",
        600
      );
      setTimeout(() => askNextField(newState), 1200);
    } else if (currentField === "gmail") {
      if (
        lower.includes("no") ||
        lower.includes("skip") ||
        lower.includes("later")
      ) {
        setShowGmail(false);
        const newState = { ...state, gmailDeclined: true };
        updateState({ gmailDeclined: true });
        addAgentMsg("No problem, you can always connect it later.", 600);
        setTimeout(() => askNextField(newState), 1200);
      } else if (text.includes("@")) {
        setShowGmail(false);
        const email = text.trim();
        const newState = { ...state, gmail: email, gmailConnected: true };
        updateState({ gmail: email, gmailConnected: true });
        addAgentMsg(`Connected to ${email}.`, 600);
        setTimeout(() => askNextField(newState), 1200);
      } else {
        addAgentMsg(
          "You can type your email address, use the card above, or just say skip.",
          600
        );
      }
    }
  };

  const displayName = state.agentName || pendingName || "Persona";

  // === RENDER ===

  // Graduation screen
  if (phase === "done") {
    return (
      <div className="h-full flex flex-col bg-black">
        <GraduationStep state={state} />
      </div>
    );
  }

  // Full-screen call UI
  if (phase === "calling") {
    return (
      <div className="h-full flex flex-col bg-black relative">
        <CallUI
          agentName={displayName}
          state={state}
          onStateUpdate={updateState}
          onCallEnd={handleCallEnd}
          onCallDecline={handleCallDecline}
        />
      </div>
    );
  }

  // Naming phase — centered, minimal
  if (phase === "naming" && messages.length === 0 && !pendingName) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black px-6">
        <h1
          className="text-[48px] font-bold tracking-[-0.02em] text-white mb-3 animate-fade-in"
        >
          Persona
        </h1>
        <p
          className="text-[17px] text-[var(--text-secondary)] tracking-[-0.01em] mb-16 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Let&apos;s set up your assistant.
        </p>
        {inputVisible && (
          <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <ChatInput
              onSend={handleSend}
              placeholder="Give your agent a name..."
              autoFocus
            />
          </div>
        )}
      </div>
    );
  }

  // Chat-based flow (naming confirmation + text-collect)
  return (
    <div className="h-full flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
        <div className="max-w-[480px] mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} agentName={displayName} />
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
                updateState({ gmail: email, gmailConnected: true });
                addAgentMsg(`Connected to ${email}.`);
                setTimeout(() => askNextField(newState), 1000);
              }}
              onDecline={() => {
                setShowGmail(false);
                const newState = { ...state, gmailDeclined: true };
                updateState({ gmailDeclined: true });
                addAgentMsg("No problem, you can always connect it later.");
                setTimeout(() => askNextField(newState), 1000);
              }}
            />
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="max-w-[480px] mx-auto w-full">
        <ChatInput
          onSend={handleSend}
          placeholder={
            phase === "naming" && !pendingName
              ? "Give your agent a name..."
              : phase === "naming"
              ? "Yes / pick a different name"
              : "Type a message..."
          }
        />
      </div>
    </div>
  );
}

function isAffirmative(text: string): boolean {
  const words = [
    "yes", "yeah", "yep", "sure", "ok", "okay", "ready",
    "sounds good", "perfect", "let's go", "yup", "ya", "ye",
    "absolutely", "definitely", "of course", "right", "correct",
  ];
  return words.some((w) => text.includes(w));
}
