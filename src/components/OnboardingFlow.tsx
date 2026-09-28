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

type Phase = "naming" | "confirming" | "calling" | "text-collect" | "done";

export default function OnboardingFlow() {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("naming");
  const [showGmail, setShowGmail] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [revealStage, setRevealStage] = useState(0); // 0=nothing, 1=headline, 2=subtitle, 3=input
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showGmail]);

  // Staged welcome reveal — no CSS animation classes, pure transitions
  useEffect(() => {
    const t1 = setTimeout(() => setRevealStage(1), 100);
    const t2 = setTimeout(() => setRevealStage(2), 500);
    const t3 = setTimeout(() => setRevealStage(3), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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

  const askNextField = useCallback(
    (currentState: OnboardingState) => {
      const missing = getMissingFields(currentState);
      if (missing.length === 0 || isOnboardingComplete(currentState)) {
        addAgentMsg("That's everything I need. Let me get things set up for you.");
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
          addAgentMsg("Want to connect your Gmail? It'll let me help with your email.", 800);
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
        addAgentMsg("Looks like we got cut off -- no worries, let's finish up here.", 600);
        setPhase("text-collect");
        setTimeout(() => askNextField(next), 2000);
      }
      return next;
    });
  }, [addAgentMsg, addSystemMsg, askNextField]);

  const handleCallDecline = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, callStatus: "declined" as const, callDeclined: true };
      addAgentMsg("No problem at all! We can do this over text. Just as easy.", 400);
      setPhase("text-collect");
      setTimeout(() => askNextField(next), 1500);
      return next;
    });
  }, [addAgentMsg, askNextField]);

  // === HANDLE NAMING (welcome screen input) ===
  const handleNameSubmit = (name: string) => {
    // Fade out welcome, transition to confirming phase
    setShowWelcome(false);
    updateState({ agentName: name });

    // Show in chat
    setTimeout(() => {
      addUserMsg(name);
      addAgentMsg(`${name} -- I like it. Sound good?`, 800);
      setPhase("confirming");
    }, 300);
  };

  // === HANDLE ALL CHAT INPUT ===
  const handleSend = (text: string) => {
    addUserMsg(text);
    const lower = text.toLowerCase().trim();

    if (phase === "confirming") {
      if (isAffirmative(lower)) {
        addAgentMsg(`Perfect. I'm ${state.agentName}.`, 600);
        setTimeout(() => {
          updateState({ callStatus: "pending" });
          setPhase("calling");
        }, 2000);
      } else {
        // They want a different name
        const newName = text.trim();
        updateState({ agentName: newName });
        addAgentMsg(`${newName} it is. Sound good?`, 800);
      }
      return;
    }

    if (phase === "text-collect") {
      handleTextCollect(text, lower);
      return;
    }
  };

  const handleTextCollect = (text: string, lower: string) => {
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
      const next = { ...state, userName: name };
      updateState({ userName: name });
      addAgentMsg(`Nice to meet you, ${name}.`, 600);
      setTimeout(() => askNextField(next), 1200);
    } else if (currentField === "userNeed") {
      const need = text.trim();
      const next = { ...state, userNeed: need };
      updateState({ userNeed: need });
      addAgentMsg("Got it -- that's exactly the kind of thing I can help with.", 600);
      setTimeout(() => askNextField(next), 1200);
    } else if (currentField === "gmail") {
      if (lower.includes("no") || lower.includes("skip") || lower.includes("later")) {
        setShowGmail(false);
        const next = { ...state, gmailDeclined: true };
        updateState({ gmailDeclined: true });
        addAgentMsg("No problem, you can always connect it later.", 600);
        setTimeout(() => askNextField(next), 1200);
      } else if (text.includes("@")) {
        setShowGmail(false);
        const email = text.trim();
        const next = { ...state, gmail: email, gmailConnected: true };
        updateState({ gmail: email, gmailConnected: true });
        addAgentMsg(`Connected to ${email}.`, 600);
        setTimeout(() => askNextField(next), 1200);
      } else {
        addAgentMsg("You can type your email address, use the card above, or just say skip.", 600);
      }
    }
  };

  const displayName = state.agentName || "Persona";

  // === RENDER ===

  // Graduation
  if (phase === "done") {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: "var(--surface-black)" }}>
        <GraduationStep state={state} />
      </div>
    );
  }

  // Call
  if (phase === "calling") {
    return (
      <div className="h-full flex flex-col relative" style={{ backgroundColor: "var(--surface-black)" }}>
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

  // Welcome — centered hero with staged transitions (no CSS animation classes)
  if (phase === "naming" && showWelcome) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--surface-black)" }}
      >
        {/* Headline */}
        <h1
          className="hero-display text-center"
          style={{
            fontSize: "56px",
            fontWeight: 600,
            lineHeight: 1.07,
            letterSpacing: "-0.28px",
            color: "var(--on-dark)",
            opacity: revealStage >= 1 ? 1 : 0,
            transform: revealStage >= 1 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 600ms cubic-bezier(0.25,0.1,0.25,1), transform 600ms cubic-bezier(0.25,0.1,0.25,1)",
            willChange: "opacity, transform",
          }}
        >
          Let&apos;s set up your Persona.
        </h1>

        {/* Subtitle */}
        <p
          className="mt-3 text-center"
          style={{
            fontSize: "28px",
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: "0.196px",
            color: "var(--body-muted)",
            opacity: revealStage >= 2 ? 1 : 0,
            transform: revealStage >= 2 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 600ms cubic-bezier(0.25,0.1,0.25,1), transform 600ms cubic-bezier(0.25,0.1,0.25,1)",
            willChange: "opacity, transform",
          }}
        >
          First, give your agent a name.
        </p>

        {/* Input */}
        <div
          className="w-full max-w-[400px] mt-16"
          style={{
            opacity: revealStage >= 3 ? 1 : 0,
            transform: revealStage >= 3 ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 500ms cubic-bezier(0.25,0.1,0.25,1), transform 500ms cubic-bezier(0.25,0.1,0.25,1)",
            willChange: "opacity, transform",
          }}
        >
          {revealStage >= 3 && (
            <ChatInput
              onSend={handleNameSubmit}
              placeholder="Name your agent..."
              autoFocus
              large
            />
          )}
        </div>
      </div>
    );
  }

  // Chat (confirming name / text-collect)
  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "var(--surface-black)" }}
    >
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-4">
        <div className="max-w-[480px] mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} agentName={displayName} />
          ))}
          {showGmail && (
            <GmailConnect
              suggestedEmail={state.gmail}
              onConnect={(email) => {
                setShowGmail(false);
                const next = { ...state, gmail: email, gmailConnected: true };
                updateState({ gmail: email, gmailConnected: true });
                addAgentMsg(`Connected to ${email}.`);
                setTimeout(() => askNextField(next), 1000);
              }}
              onDecline={() => {
                setShowGmail(false);
                const next = { ...state, gmailDeclined: true };
                updateState({ gmailDeclined: true });
                addAgentMsg("No problem, you can always connect it later.");
                setTimeout(() => askNextField(next), 1000);
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
            phase === "confirming"
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
    "good", "great", "love it", "like it",
  ];
  return words.some((w) => text.includes(w));
}
