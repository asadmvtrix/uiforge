import React, { useState } from "react";
import { Stack } from "../../lib/stacks";
import { Settings } from "../../types";
import { AnimatePresence, m } from "framer-motion";
import UploadTab from "./tabs/UploadTab";
import TextTab from "./tabs/TextTab";
import ImportTab from "./tabs/ImportTab";

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

type InputTab = "upload" | "text" | "import";

function UnifiedInputPane({
  doCreate,
  doCreateFromText,
  importFromCode,
  settings,
  setSettings,
}: Props) {
  const [activeTab, setActiveTab] = useState<InputTab>("upload");

  function setStack(stack: Stack) {
    setSettings((prev: Settings) => ({
      ...prev,
      generatedCodeConfig: stack,
    }));
  }

  const tabs: { id: InputTab; label: string; icon: React.ReactNode }[] = [
    { id: "upload", label: "Upload", icon: <UploadIcon /> },
    { id: "text",   label: "Text",   icon: <TextIcon /> },
    { id: "import", label: "Import", icon: <ImportIcon /> },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Sliding pill tab bar */}
      <div className="relative flex w-full rounded-full bg-gray-100 dark:bg-zinc-800 p-1 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
            }`}
          >
            {activeTab === tab.id && (
              <m.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-white dark:bg-zinc-700 shadow-sm"
                transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.8 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -10, filter: "blur(3px)", scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.12, 0.8, 0.32, 1] as const }}
          >
            {activeTab === "upload" && (
              <UploadTab
                doCreate={doCreate}
                stack={settings.generatedCodeConfig}
                setStack={setStack}
              />
            )}
            {activeTab === "text" && (
              <TextTab
                doCreateFromText={doCreateFromText}
                stack={settings.generatedCodeConfig}
                setStack={setStack}
              />
            )}
            {activeTab === "import" && (
              <ImportTab importFromCode={importFromCode} />
            )}
          </m.div>
        </AnimatePresence>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default UnifiedInputPane;
