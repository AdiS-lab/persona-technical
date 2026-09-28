"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { OnboardingState, ChatMessage, initialOnboardingState } from "@/lib/types";
import { getMissingFields, isOnboardingComplete } from "@/lib/onboarding-state";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import GmailConnect from "./GmailConnect";
import CallUI from "./CallUI";
import GraduationStep from "./GraduationStep";

type Phase = "naming" | "call-offer" | "calling" | "text-collect" | "done";

export default function OnboardingFlow() {
  const [state, setState] = useState<OnboardingState>(initialOnboardingState);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("naming");
  const [showGmail, setShowGmail] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showGmail, phase]);

  // Welcome messages on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    addAgentMsg("Hey! Welcome to Persona.", 500);
    addAgentMsg(
      "I'm going to be your personal AI assistant -- but first, I need a name. What would you like to call me?",
      1700
    );
  }, []);

  const addAgentMsg = useCallback((content: string, delay = 0) => {
    const msg: ChatMessage = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "agent",
      content,
      timestamp: Date.now(),
    };
    if (delay) {
      setTimeout(() => setMessages((prev) => [...prev, msg]), delay);
    } else {
      setMessages((prev) => [...prev, msg]);
    }
  }, []);

  const addUserMsg = useCallback((content: string) => {
    const msg: ChatMessage = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  const addSystemMsg = useCallback((content: string, delay = 0) => {
    const msg: ChatMessage = {
      id: `s-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: "system",
      content,
      timestamp: Date.now(),
    };
    if (delay) {
      setTimeout(() => setMessages((prev) => [...prev, msg]), delay);
    } else {
      setMessages((prev) => [...prev, msg]);
    }
  }, []);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  // Ask for the next missing field in text-collect phase
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

  // Transition from call to text
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

  // Handle user input
  const handleSend = (text: string) => {
    addUserMsg(text);
    const lower = text.toLowerCase().trim();

    if (phase === "naming") {
      if (!pendingName) {
        const name = text.trim();
        setPendingName(name);
        addAgentMsg(`${name} -- I like that. Sound good?`, 800);
      } else {
        // Confirming or changing
        if (
          lower === "yes" || lower === "yeah" || lower === "sure" ||
          lower === "yep" || lower === "ok" || lower === "ready" ||
          lower.includes("let's go") || lower.includes("sounds good") ||
          lower.includes("perfect")
        ) {
          const name = pendingName;
          updateState({ agentName: name });
          addAgentMsg(`Perfect. I'm ${name}. Nice to meet you.`, 600);
          addAgentMsg(
            "I'd love to hop on a quick call to get to know you better. Want me to call you?",
            1800
          );
          setPhase("call-offer");
        } else {
          // They're providing a new name
          const newName = text.trim();
          setPendingName(newName);
          addAgentMsg(`${newName} it is. Sound good?`, 800);
        }
      }
      return;
    }

    if (phase === "call-offer") {
      if (
        lower === "yes" || lower === "yeah" || lower === "sure" ||
        lower === "yep" || lower === "ok" || lower === "call me" ||
        lower.includes("let's do it") || lower.includes("go ahead")
      ) {
        setPhase("calling");
        updateState({ callStatus: "pending" });
      } else if (
        lower === "no" || lower.includes("skip") || lower.includes("text") ||
        lower.includes("rather not") || lower.includes("no thanks") ||
        lower.includes("nah")
      ) {
        handleCallDecline();
      } else {
        // Ambiguous — gently re-ask
        addAgentMsg(
          "Just a quick voice call so I can learn what you need. You can also say 'text' if you'd prefer that.",
          600
        );
      }
      return;
    }

    if (phase === "text-collect") {
      handleTextCollect(text, lower);
      return;
    }
  };

  const handleTextCollect = (text: string, lower: string) => {
    // Check if they want to rename the agent
    if (
      lower.includes("rename") ||
      lower.includes("change your name") ||
      lower.includes("call you something else") ||
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
      addAgentMsg("Got it -- that's exactly the kind of thing I can help with.", 600);
      setTimeout(() => askNextField(newState), 1200);
    } else if (currentField === "gmail") {
      if (lower.includes("no") || lower.includes("skip") || lower.includes("later")) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {displayName}
            </h1>
            <p className="text-[11px] text-zinc-400">
              {phase === "done"
                ? "Ready"
                : phase === "calling"
                ? state.callStatus === "active"
                  ? "On a call"
                  : "Calling..."
                : "Setting up"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {[
            !!state.agentName,
            !!state.userName,
            !!state.gmailConnected || state.gmailDeclined,
            !!state.userNeed,
          ].map((done, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                done ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main content */}
      {phase === "done" ? (
        <GraduationStep state={state} />
      ) : phase === "calling" ? (
        <>
          {/* Show chat history above the call UI */}
          {messages.length > 0 && (
            <div className="px-4 pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 max-h-[30%] overflow-y-auto">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} agentName={displayName} />
              ))}
            </div>
          )}
          <CallUI
            agentName={displayName}
            state={state}
            onStateUpdate={updateState}
            onCallEnd={handleCallEnd}
            onCallDecline={handleCallDecline}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} agentName={displayName} />
            ))}
            {showGmail && (
              <GmailConnect
                suggestedEmail={state.gmail}
                onConnect={(email) => {
                  setShowGmail(false);
                  const newState = { ...state, gmail: email, gmailConnected: true };
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
          <ChatInput
            onSend={handleSend}
            placeholder={
              phase === "naming" && !pendingName
                ? "Give me a name..."
                : phase === "naming"
                ? "Yes / pick a different name"
                : "Type a message..."
            }
          />
        </div>
      )}
    </div>
  );
}
