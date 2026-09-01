import React from "react";
import { Settings } from "../../types";
import { Stack } from "../../lib/stacks";
import UnifiedInputPane from "../unified-input/UnifiedInputPane";

const TIPS = [
  { key: "⌘ + Enter", desc: "Generate from text prompt" },
  { key: "Alt + 1–4", desc: "Switch between generated variants" },
  { key: "Click element", desc: "Select & edit any UI element" },
  { key: "⌘ + Z", desc: "Undo last edit" },
];

const HIGHLIGHTS = [
  { label: "4 parallel variants", sub: "Gemini + Claude run simultaneously" },
  { label: "8 output stacks", sub: "Tailwind, React, Vue, Bootstrap…" },
  { label: "Live preview", sub: "See output render as it streams" },
];

interface Props {
  doCreate: (
    images: string[],
    inputMode: "image" | "video",
    textPrompt?: string
  ) => void;
  doCreateFromText: (text: string) => void;
  importFromCode: (code: string, stack: Stack) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const StartPane: React.FC<Props> = ({
  doCreate,
  doCreateFromText,
  importFromCode,
  settings,
  setSettings,
}) => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-y-auto">
      <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-8 min-h-full">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          What are we building?
        </h1>
        <p className="mt-1.5 text-[13px] text-gray-400 dark:text-zinc-500 mb-8">
          Screenshot, text prompt, or paste existing code.
        </p>
        <UnifiedInputPane
          doCreate={doCreate}
          doCreateFromText={doCreateFromText}
          importFromCode={importFromCode}
          settings={settings}
          setSettings={setSettings}
        />

        {/* ── Bottom fill ── */}
        <div className="w-full max-w-3xl mt-10 grid gap-6 sm:grid-cols-2">
          {/* Keyboard shortcuts */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-3">
              Shortcuts
            </p>
            <div className="space-y-2.5">
              {TIPS.map((t) => (
                <div key={t.key} className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-mono bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-2 py-0.5 rounded-lg shrink-0">
                    {t.key}
                  </span>
                  <span className="text-[12px] text-gray-500 dark:text-zinc-400 text-right">
                    {t.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature highlights */}
          <div className="rounded-2xl border border-gray-100 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-600 mb-3">
              What you get
            </p>
            <div className="space-y-3">
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium text-gray-700 dark:text-zinc-200">{h.label}</p>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500">{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPane;
