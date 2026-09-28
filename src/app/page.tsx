import OnboardingFlow from "@/components/OnboardingFlow";

export default function Home() {
  return (
    <div className="h-screen w-full max-w-md mx-auto flex flex-col bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800">
      <OnboardingFlow />
    </div>
  );
}
