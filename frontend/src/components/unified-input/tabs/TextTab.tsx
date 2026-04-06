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

  const handleExampleClick = (example: string) => {
    setText(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Textarea
        ref={textareaRef}
        rows={3}
        placeholder="Describe the UI you want to create..."
        className="w-full resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        data-testid="text-input"
      />

      <div className="flex flex-wrap gap-1.5">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example)}
            className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-600 transition-colors truncate max-w-[220px]"
            title={example}
          >
            {example.length > 35 ? example.slice(0, 35) + "…" : example}
          </button>
        ))}
      </div>

      <OutputSettingsSection
        stack={stack}
        setStack={setStack}
      />

      <Button
        onClick={handleGenerate}
        className="w-full"
        size="lg"
        data-testid="text-generate"
      >
        Generate
      </Button>

      <p className="text-xs text-gray-400 dark:text-zinc-500 text-center">
        Press Cmd/Ctrl + Enter to generate
      </p>
    </div>
  );
}

export default TextTab;
