import { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import toast from "react-hot-toast";
import OutputSettingsSection from "../../settings/OutputSettingsSection";
import { Stack } from "../../../lib/stacks";

interface Props {
  doCreateFromText: (text: string) => void;
  stack: Stack;
  setStack: (stack: Stack) => void;
}

const ALL_EXAMPLES = [
  "An ecommerce homepage for eco-friendly skincare with product grid, reviews, and newsletter signup",
  "A portfolio site for a product designer with case studies, process steps, and contact",
  "A mobile fitness app dashboard with workout plan, progress ring, and quick-start buttons",
  "A music streaming app with now-playing, recommended playlists, and recent listens",
  "A SaaS pricing page with three tiers, feature comparison table, and FAQ accordion",
  "A real estate listing page with image carousel, property details, map, and contact form",
  "A restaurant ordering app with menu categories, cart sidebar, and checkout flow",
  "A project management dashboard with kanban board, team avatars, and progress charts",
  "A social media profile page with post feed, stories bar, and follower stats",
  "A weather app with current conditions, 7-day forecast, and hourly breakdown",
  "A blog homepage with featured post hero, category tags, and infinite scroll grid",
  "A banking app dashboard with account balance, recent transactions, and spending chart",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TextTab({ doCreateFromText, stack, setStack }: Props) {
  // Shuffle on every render (new random set each time component mounts or tab switches)
  const [examples] = useState<string[]>(() => shuffle(ALL_EXAMPLES).slice(0, 4));
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleGenerate = () => {
    if (text.trim() === "") {
      toast.error("Please enter a description");
      return;
    }
    doCreateFromText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleRandomPrompt = () => {
    const remaining = examples.filter((e) => e !== text);
    const pool = remaining.length > 0 ? remaining : examples;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setText(pick);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Textarea with random-prompt button inside */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          rows={4}
          placeholder="Describe the UI you want to create..."
          className="w-full resize-none pr-10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="text-input"
        />
        <button
          type="button"
          onClick={handleRandomPrompt}
          title="Random prompt"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-xl text-indigo-400 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sparkle-icon">
            <path d="M12 0C12 0 14 8 14 10C14 12 12 24 12 24C12 24 10 12 10 10C10 8 12 0 12 0Z"/>
            <path d="M0 12C0 12 8 10 10 10C12 10 24 12 24 12C24 12 12 14 10 14C8 14 0 12 0 12Z"/>
          </svg>
        </button>
      </div>

      <OutputSettingsSection
        stack={stack}
        setStack={setStack}
      />

      <Button
        onClick={handleGenerate}
        className="btn-studio-action w-full max-w-xs mx-auto"
        size="lg"
        data-testid="text-generate"
      >
        Generate
      </Button>

      <p className="text-[11px] text-center text-gray-400 dark:text-zinc-600">
        Press <kbd className="px-1 py-0.5 rounded border border-gray-200 dark:border-zinc-700 font-mono text-[10px]">⌘</kbd> + <kbd className="px-1 py-0.5 rounded border border-gray-200 dark:border-zinc-700 font-mono text-[10px]">↵</kbd> to generate
      </p>
    </div>
  );
}

export default TextTab;
