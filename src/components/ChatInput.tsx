"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  large?: boolean;
}

export default function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  autoFocus = true,
  large = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      // Small delay to ensure DOM is ready
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) {
        // Shake on empty submit
        setShaking(true);
        setTimeout(() => setShaking(false), 300);
        return;
      }
      if (disabled) return;
      onSend(trimmed);
      setInput("");
    }
  };

  return (
    <div className="px-6 pb-6 pt-2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-transparent outline-none disabled:opacity-30 ${
          shaking ? "animate-shake" : ""
        }`}
        style={{
          fontSize: large ? "28px" : "17px",
          fontWeight: large ? 400 : 400,
          lineHeight: large ? "1.14" : "1.47",
          letterSpacing: large ? "0.196px" : "-0.374px",
          color: "var(--on-dark)",
          borderBottom: "1px solid var(--divider)",
          paddingBottom: "12px",
          fontFamily: "inherit",
        }}
      />
      <style jsx>{`
        input::placeholder {
          color: var(--ink-muted-48);
        }
      `}</style>
    </div>
  );
}
