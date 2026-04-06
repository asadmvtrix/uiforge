import React from "react";
import { Settings } from "../../types";
import { Stack } from "../../lib/stacks";
import UnifiedInputPane from "../unified-input/UnifiedInputPane";

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
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          What are we building?
        </h1>
        <p className="mt-1 text-[13px] text-gray-400 dark:text-zinc-500 mb-6">
          Screenshot, text prompt, or paste existing code.
        </p>
        <UnifiedInputPane
          doCreate={doCreate}
          doCreateFromText={doCreateFromText}
          importFromCode={importFromCode}
          settings={settings}
          setSettings={setSettings}
        />
      </div>
    </div>
  );
};

export default StartPane;
