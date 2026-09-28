"use client";

import { OnboardingState } from "@/lib/types";

interface GraduationStepProps {
  state: OnboardingState;
}

export default function GraduationStep({ state }: GraduationStepProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 gap-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-semibold">
        {state.agentName?.charAt(0).toUpperCase() || "P"}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          You&apos;re all set{state.userName ? `, ${state.userName}` : ""}.
        </h2>
        <p className="text-sm text-zinc-500 mt-2">
          {state.agentName} is ready to help.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3 mt-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
          <span className="text-sm text-zinc-500">Agent</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {state.agentName}
          </span>
        </div>
        {state.userName && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <span className="text-sm text-zinc-500">You</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {state.userName}
            </span>
          </div>
        )}
        {state.gmailConnected && state.gmail && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <span className="text-sm text-zinc-500">Gmail</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {state.gmail}
            </span>
          </div>
        )}
        {state.userNeed && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
            <span className="text-sm text-zinc-500">First task</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
              {state.userNeed}
            </span>
          </div>
        )}
      </div>

      <button className="mt-6 px-8 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
        Start chatting with {state.agentName}
      </button>
    </div>
  );
}
