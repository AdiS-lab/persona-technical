"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function ChatInput({
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  autoFocus = true,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setInput("");
    }
  };

  return (
    <div className="px-6 py-4 animate-fade-in-up">
      <div className="border-t border-[var(--divider)]">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent pt-4 text-[17px] tracking-[-0.01em] text-white placeholder:text-[var(--text-tertiary)] outline-none disabled:opacity-30"
        />
      </div>
    </div>
  );
}
