import { LuClock, LuCode, LuSettings, LuPlus, LuSun, LuMoon } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface IconStripProps {
  isHistoryOpen: boolean;
  isEditorOpen: boolean;
  isSettingsOpen: boolean;
  showHistory: boolean;
  showEditor: boolean;
  isDark: boolean;
  onToggleHistory: () => void;
  onToggleEditor: () => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
}

function IconStrip({
  isHistoryOpen,
  isEditorOpen,
  isSettingsOpen,
  showHistory,
  showEditor,
  isDark,
  onToggleHistory,
  onToggleEditor,
  onNewProject,
  onOpenSettings,
  onToggleTheme,
}: IconStripProps) {
  const navigate = useNavigate();

  const btn = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-100 ${
      active
        ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800"
        : "text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white"
    }`;

  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white px-2 py-1.5 dark:border-zinc-800 dark:bg-zinc-950 lg:h-full lg:w-12 lg:flex-col lg:items-center lg:justify-start lg:gap-0.5 lg:border-b-0 lg:border-r lg:px-1.5 lg:py-2 lg:[&>div:last-child]:mt-auto">

      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        title="Home"
        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors lg:mb-4"
      >
        <img src="/favicon/main.png" alt="" className="h-4 w-4 dark:invert" />
      </button>

      {/* Middle group — visible on both mobile and desktop */}
      <div className="flex items-center gap-0.5 lg:flex-col lg:w-full">
        {showEditor && (
          <button onClick={onToggleEditor} title="Editor" className={btn(isEditorOpen)}>
            <LuCode className="h-4 w-4" />
          </button>
        )}
        {showHistory && (
          <button onClick={onToggleHistory} title="Versions" className={btn(isHistoryOpen)}>
            <LuClock className="h-4 w-4" />
          </button>
        )}
        <button onClick={onNewProject} title="New" className={btn(false)}>
          <LuPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Right group on mobile, bottom on desktop */}
      <div className="flex items-center gap-0.5 lg:flex-col lg:w-full lg:mt-auto">
        <div className="hidden flex-1 lg:block" />
        <button onClick={onToggleTheme} title="Toggle theme" className={btn(false)}>
          {isDark ? <LuSun className="h-4 w-4" /> : <LuMoon className="h-4 w-4" />}
        </button>
        <button onClick={onOpenSettings} title="Settings" className={btn(isSettingsOpen)}>
          <LuSettings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default IconStrip;
