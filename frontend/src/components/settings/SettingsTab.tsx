import React, { useState } from "react";
import { AppTheme, EditorTheme, Settings } from "../../types";
import { capitalize } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

type ApiKeyType = "openai" | "anthropic" | "gemini" | "openaiBaseUrl";

const API_KEY_OPTIONS: { value: ApiKeyType; label: string; placeholder: string }[] = [
  { value: "openai", label: "OpenAI", placeholder: "sk-..." },
  { value: "anthropic", label: "Anthropic", placeholder: "sk-ant-..." },
  { value: "gemini", label: "Gemini", placeholder: "AIza..." },
  { value: "openaiBaseUrl", label: "OpenAI Base URL (proxy)", placeholder: "https://..." },
];

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  appTheme: AppTheme;
  setAppTheme: React.Dispatch<React.SetStateAction<AppTheme>>;
  onBack: () => void;
}

function SettingsTab({ settings, setSettings, appTheme, setAppTheme, onBack }: Props) {
  const [selectedKeyType, setSelectedKeyType] = useState<ApiKeyType>("openai");
  const [pendingKeyValue, setPendingKeyValue] = useState("");

  const handleThemeChange = (theme: EditorTheme) => {
    setSettings((s) => ({
      ...s,
      editorTheme: theme,
    }));
  };

  const savedKeys: { type: ApiKeyType; label: string; value: string }[] = API_KEY_OPTIONS
    .filter(opt => {
      if (opt.value === "openai") return !!settings.openAiApiKey;
      if (opt.value === "anthropic") return !!settings.anthropicApiKey;
      if (opt.value === "gemini") return !!settings.geminiApiKey;
      if (opt.value === "openaiBaseUrl") return !!settings.openAiBaseURL;
      return false;
    })
    .map(opt => ({
      type: opt.value,
      label: opt.label,
      value:
        opt.value === "openai" ? settings.openAiApiKey! :
        opt.value === "anthropic" ? settings.anthropicApiKey! :
        opt.value === "gemini" ? settings.geminiApiKey! :
        settings.openAiBaseURL!,
    }));

  const handleSaveKey = () => {
    const v = pendingKeyValue.trim();
    if (!v) return;
    setSettings(s => ({
      ...s,
      openAiApiKey: selectedKeyType === "openai" ? v : s.openAiApiKey,
      anthropicApiKey: selectedKeyType === "anthropic" ? v : s.anthropicApiKey,
      geminiApiKey: selectedKeyType === "gemini" ? v : s.geminiApiKey,
      openAiBaseURL: selectedKeyType === "openaiBaseUrl" ? v : s.openAiBaseURL,
    }));
    setPendingKeyValue("");
  };

  const handleRemoveKey = (type: ApiKeyType) => {
    setSettings(s => ({
      ...s,
      openAiApiKey: type === "openai" ? null : s.openAiApiKey,
      anthropicApiKey: type === "anthropic" ? null : s.anthropicApiKey,
      geminiApiKey: type === "gemini" ? null : s.geminiApiKey,
      openAiBaseURL: type === "openaiBaseUrl" ? null : s.openAiBaseURL,
    }));
  };

  const maskKey = (val: string) => {
    if (val.length <= 8) return "••••••••";
    return val.slice(0, 4) + "••••••••" + val.slice(-4);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-4 lg:px-6 lg:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>

        <div className="mx-auto max-w-lg space-y-6">
          {/* Theme */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/60">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                Theme
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-700">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm text-gray-700 dark:text-zinc-300">
                    App Theme
                  </span>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                    System default, with optional light/dark override
                  </p>
                </div>
                <Select
                  name="app-theme"
                  value={appTheme}
                  onValueChange={(value) => setAppTheme(value as AppTheme)}
                >
                  <SelectTrigger className="w-[140px]">
                    {capitalize(appTheme)}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AppTheme.SYSTEM}>System</SelectItem>
                    <SelectItem value={AppTheme.LIGHT}>Light</SelectItem>
                    <SelectItem value={AppTheme.DARK}>Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm text-gray-700 dark:text-zinc-300">
                    Code Editor Theme
                  </span>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
                    Requires page refresh to update
                  </p>
                </div>
                <Select
                  name="editor-theme"
                  value={settings.editorTheme}
                  onValueChange={(value) =>
                    handleThemeChange(value as EditorTheme)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <span className="notranslate" translate="no">
                      {capitalize(settings.editorTheme)}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cobalt">
                      <span className="notranslate" translate="no">Cobalt</span>
                    </SelectItem>
                    <SelectItem value="espresso">
                      <span className="notranslate" translate="no">Espresso</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/60">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                API Keys
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Stored only in your browser.
              </p>

              {/* Saved keys */}
              {savedKeys.length > 0 && (
                <div className="space-y-2">
                  {savedKeys.map(k => (
                    <div
                      key={k.type}
                      className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-gray-600 dark:text-zinc-300 shrink-0">
                          {k.label}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono truncate">
                          {maskKey(k.value)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveKey(k.type)}
                        className="ml-2 shrink-0 rounded p-1 text-gray-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors"
                        aria-label={`Remove ${k.label} key`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add key row */}
              <div className="flex gap-2">
                <Select value={selectedKeyType} onValueChange={v => setSelectedKeyType(v as ApiKeyType)}>
                  <SelectTrigger className="shrink-0 w-36 text-xs">
                    {API_KEY_OPTIONS.find(o => o.value === selectedKeyType)?.label ?? ""}
                  </SelectTrigger>
                  <SelectContent>
                    {API_KEY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1 text-xs font-mono"
                  placeholder={API_KEY_OPTIONS.find(o => o.value === selectedKeyType)?.placeholder ?? ""}
                  value={pendingKeyValue}
                  onChange={e => setPendingKeyValue(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSaveKey(); }}
                  type="password"
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!pendingKeyValue.trim()}
                  className="shrink-0 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Save key"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Image Generation */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/60">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-700">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                Image Generation
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-zinc-300">
                    Placeholder Images
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
                    More fun with it but if you want to save money, turn it off.
                  </p>
                </div>
                <Switch
                  id="image-generation"
                  checked={settings.isImageGenerationEnabled}
                  onCheckedChange={() =>
                    setSettings((s) => ({
                      ...s,
                      isImageGenerationEnabled: !s.isImageGenerationEnabled,
                    }))
                  }
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingsTab;
