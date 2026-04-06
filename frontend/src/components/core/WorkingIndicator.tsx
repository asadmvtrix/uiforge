import { useState, useEffect } from "react";
import WorkingPulse from "./WorkingPulse";

const STATUS_MESSAGES = [
  "Analyzing your screenshot",
  "Understanding the layout",
  "Identifying components",
  "Mapping colors and fonts",
  "Writing HTML structure",
  "Adding Tailwind classes",
  "Making it responsive",
  "Wiring up interactions",
  "Cleaning up the code",
  "Almost there",
];

interface Props {
  elapsedSeconds?: number;
}

export default function WorkingIndicator({ elapsedSeconds }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="working-indicator-bg mb-3 rounded-xl border border-indigo-200 dark:border-indigo-800 px-4 py-3 transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <WorkingPulse />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Generating
          </span>
        </div>
        <span className="text-xs font-mono tabular-nums text-gray-500 dark:text-gray-400">
          {elapsedSeconds ? `${elapsedSeconds}s` : "--"}
        </span>
      </div>
      <p
        key={messageIndex}
        className="mt-2 text-xs text-gray-500 dark:text-gray-400 animate-fade-in-up"
      >
        {STATUS_MESSAGES[messageIndex]}...
      </p>
    </div>
  );
}
