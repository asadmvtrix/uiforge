import { useEffect, useRef, useState } from "react";
import { generateCode } from "./generateCode";
import { AppState, AppTheme, EditorTheme, Settings } from "./types";
import { usePersistedState } from "./hooks/usePersistedState";
import { USER_CLOSE_WEB_SOCKET_CODE } from "./constants";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { Stack } from "./lib/stacks";
import useBrowserTabIndicator from "./hooks/useBrowserTabIndicator";
import { LuChevronLeft } from "react-icons/lu";
import {
  buildAssistantHistoryMessage,
  buildUserHistoryMessage,
  cloneVariantHistory,
  GenerationRequest,
  registerAssetIds,
  toRequestHistory,
} from "./lib/prompt-history";
import { useAppStore } from "./store/app-store";
import { useProjectStore } from "./store/project-store";
import { removeHighlight } from "./components/select-and-edit/utils";
import Sidebar from "./components/sidebar/Sidebar";
import IconStrip from "./components/sidebar/IconStrip";
import HistoryDisplay from "./components/history/HistoryDisplay";
import PreviewPane from "./components/preview/PreviewPane";
import StartPane from "./components/start-pane/StartPane";
import SettingsTab from "./components/settings/SettingsTab";
import { Commit } from "./components/commits/types";
import { createCommit } from "./components/commits/utils";
import { AnimatePresence, m } from "framer-motion";

function App() {
  const {
    // Inputs
    inputMode,
    setInputMode,
    referenceImages,
    setReferenceImages,
    initialPrompt,
    setInitialPrompt,
    upsertPromptAssets,
    resetPromptAssets,

    head,
    commits,
    addCommit,
    removeCommit,
    setHead,
    appendCommitCode,
    setCommitCode,
    resetCommits,
    resetHead,
    updateVariantStatus,
    resizeVariants,
    setVariantModels,
    appendVariantHistoryMessage,
    startAgentEvent,
    appendAgentEventContent,
    finishAgentEvent,

    // Outputs
    appendExecutionConsole,
    resetExecutionConsoles,
  } = useProjectStore();

  const {
    disableInSelectAndEditMode,
    setUpdateInstruction,
    updateImages,
    setUpdateImages,
    appState,
    setAppState,
    selectedElement,
    setSelectedElement,
  } = useAppStore();

  // Settings
  const [settings, setSettings] = usePersistedState<Settings>(
    {
      openAiApiKey: null,
      openAiBaseURL: null,
      anthropicApiKey: null,
      geminiApiKey: null,
      isImageGenerationEnabled: true,
      editorTheme: EditorTheme.COBALT,
      generatedCodeConfig: Stack.HTML_TAILWIND,
    },
    "setting"
  );
  const [appTheme, setAppTheme] = usePersistedState<AppTheme>(
    AppTheme.SYSTEM,
    "app-theme"
  );

  const wsRef = useRef<WebSocket>(null);
  const lastThinkingEventIdRef = useRef<Record<number, string>>({});
  const lastAssistantEventIdRef = useRef<Record<number, string>>({});
  const lastToolEventIdRef = useRef<Record<number, string>>({});

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<"preview" | "chat">("preview");
  const showSelectAndEditFeature =
    settings.generatedCodeConfig === Stack.HTML_TAILWIND ||
    settings.generatedCodeConfig === Stack.HTML_CSS;

  // Indicate coding state using the browser tab's favicon and title
  useBrowserTabIndicator(appState === AppState.CODING);

  // When the user already has the settings in local storage, newly added keys
  // do not get added to the settings so if it's falsy, we populate it with the default
  // value
  useEffect(() => {
    if (!settings.generatedCodeConfig) {
      setSettings((prev) => ({
        ...prev,
        generatedCodeConfig: Stack.HTML_TAILWIND,
      }));
    }
  }, [settings.generatedCodeConfig, setSettings]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark =
        appTheme === AppTheme.DARK ||
        (appTheme === AppTheme.SYSTEM && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (appTheme !== AppTheme.SYSTEM) {
      return;
    }

    const onChange = () => applyTheme();
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [appTheme]);

  const getAssetsById = () => useProjectStore.getState().assetsById;

  // Functions
  const reset = () => {
    setAppState(AppState.INITIAL);
    setUpdateInstruction("");
    setUpdateImages([]);
    disableInSelectAndEditMode();
    resetExecutionConsoles();

    resetCommits();
    resetHead();
    resetPromptAssets();

    // Inputs
    setInputMode("image");
    setReferenceImages([]);
  };

  const regenerate = () => {
    if (head === null) {
      toast.error(
        "No current version set. Please contact support via chat or Github."
      );
      throw new Error("Regenerate called with no head");
    }

    // Retrieve the previous command
    const currentCommit = commits[head];
    if (currentCommit.type !== "ai_create") {
      toast.error("Only the first version can be regenerated.");
      return;
    }

    // Re-run the create
    if (inputMode === "image" || inputMode === "video") {
      doCreate(referenceImages, inputMode);
    } else {
      // TODO: Fix this
      doCreateFromText(initialPrompt);
    }
  };

  // Used when the user cancels the code generation
  const cancelCodeGeneration = () => {
    wsRef.current?.close?.(USER_CLOSE_WEB_SOCKET_CODE);
  };

  // Used for user-initiated cancellation and failed edit rollbacks
  const cancelCodeGenerationAndReset = (commit: Commit) => {
    // When the current commit is the first version, reset the entire app state
    if (commit.type === "ai_create") {
      reset();
    } else {
      // Otherwise, remove current commit from commits
      removeCommit(commit.hash);

      // Revert to parent commit
      const parentCommitHash = commit.parentHash;
      if (parentCommitHash) {
        setHead(parentCommitHash);
      } else {
        throw new Error("Parent commit not found");
      }

      setAppState(AppState.CODE_READY);
    }
  };

  function doGenerateCode(params: GenerationRequest) {
    // Reset the execution console
    resetExecutionConsoles();

    // Set the app state to coding during generation
    setAppState(AppState.CODING);

    const { variantHistory, ...requestParams } = params;

    // Merge settings with params
    const updatedParams = { ...requestParams, ...settings };

    // Use 4 variants for create, 2 for edits to match backend counts
    // and avoid a flash when the backend sends the actual variant count
    const initialVariantCount =
      requestParams.generationType === "create" ? 4 : 2;
    const baseCommitObject = {
      variants: Array(initialVariantCount)
        .fill(null)
        .map(() => ({
          code: "",
          history: cloneVariantHistory(variantHistory),
        })),
    };

    const commitInputObject =
      requestParams.generationType === "create"
        ? {
            ...baseCommitObject,
            type: "ai_create" as const,
            parentHash: null,
            inputs: requestParams.prompt,
          }
        : {
            ...baseCommitObject,
            type: "ai_edit" as const,
            parentHash: head,
            inputs: requestParams.prompt,
          };

    // Create a new commit and set it as the head
    const commit = createCommit(commitInputObject);
    addCommit(commit);
    setHead(commit.hash);

    lastThinkingEventIdRef.current = {};
    lastAssistantEventIdRef.current = {};
    lastToolEventIdRef.current = {};

    const finishThinkingEvent = (variantIndex: number, status: "complete" | "error") => {
      const eventId = lastThinkingEventIdRef.current[variantIndex];
      if (!eventId) return;
      finishAgentEvent(commit.hash, variantIndex, eventId, {
        status,
        endedAt: Date.now(),
      });
      delete lastThinkingEventIdRef.current[variantIndex];
    };

    const finishAssistantEvent = (variantIndex: number, status: "complete" | "error") => {
      const eventId = lastAssistantEventIdRef.current[variantIndex];
      if (!eventId) return;
      finishAgentEvent(commit.hash, variantIndex, eventId, {
        status,
        endedAt: Date.now(),
      });
      delete lastAssistantEventIdRef.current[variantIndex];
    };

    const finishToolEvent = (variantIndex: number, status: "complete" | "error") => {
      const eventId = lastToolEventIdRef.current[variantIndex];
      if (!eventId) return;
      finishAgentEvent(commit.hash, variantIndex, eventId, {
        status,
        endedAt: Date.now(),
      });
      delete lastToolEventIdRef.current[variantIndex];
    };

    const finishInFlightEvents = (status: "complete" | "error") => {
      Object.keys(lastThinkingEventIdRef.current).forEach((key) => {
        finishThinkingEvent(Number(key), status);
      });
      Object.keys(lastAssistantEventIdRef.current).forEach((key) => {
        finishAssistantEvent(Number(key), status);
      });
      Object.keys(lastToolEventIdRef.current).forEach((key) => {
        finishToolEvent(Number(key), status);
      });
    };

    generateCode(wsRef, updatedParams, {
      onChange: (token, variantIndex) => {
        appendCommitCode(commit.hash, variantIndex, token);
      },
      onSetCode: (code, variantIndex) => {
        setCommitCode(commit.hash, variantIndex, code);
      },
      onStatusUpdate: (line, variantIndex) =>
        appendExecutionConsole(variantIndex, line),
      onVariantComplete: (variantIndex) => {
        console.log(`Variant ${variantIndex} complete event received`);
        updateVariantStatus(commit.hash, variantIndex, "complete");
        const currentCode =
          useProjectStore.getState().commits[commit.hash]?.variants[variantIndex]
            ?.code || "";
        if (currentCode.trim().length > 0) {
          appendVariantHistoryMessage(
            commit.hash,
            variantIndex,
            buildAssistantHistoryMessage(currentCode)
          );
        }
        finishThinkingEvent(variantIndex, "complete");
        finishAssistantEvent(variantIndex, "complete");
        finishToolEvent(variantIndex, "complete");
        if (commit.type === "ai_edit") {
          const {
            updateInstruction: currentInstruction,
            updateImages: currentImages,
          } = useAppStore.getState();
          const instructionUnchanged =
            currentInstruction === commit.inputs.text;
          const imagesUnchanged =
            currentImages.length === commit.inputs.images.length &&
            currentImages.every(
              (image, index) => image === commit.inputs.images[index]
            );

          // This conditional clear handles three UX scenarios:
          // 1) All variants fail: no completion event, so keep prompt/images for retry.
          // 2) A variant completes and user has typed/changed images: do not clear.
          // 3) A variant completes and user has not changed draft: clear for next edit.
          if (instructionUnchanged && imagesUnchanged) {
            setUpdateInstruction("");
            setUpdateImages([]);
          }
        }
      },
      onVariantError: (variantIndex, error) => {
        console.error(`Error in variant ${variantIndex}:`, error);
        updateVariantStatus(commit.hash, variantIndex, "error", error);
        finishThinkingEvent(variantIndex, "error");
        finishAssistantEvent(variantIndex, "error");
        finishToolEvent(variantIndex, "error");
      },
      onVariantCount: (count) => {
        console.log(`Backend is using ${count} variants`);
        resizeVariants(commit.hash, count);
      },
      onVariantModels: (models) => {
        setVariantModels(commit.hash, models);
      },
      onThinking: (content, variantIndex, eventId) => {
        if (!eventId) return;
        lastThinkingEventIdRef.current[variantIndex] = eventId;
        startAgentEvent(commit.hash, variantIndex, {
          id: eventId,
          type: "thinking",
          status: "running",
          startedAt: Date.now(),
        });
        appendAgentEventContent(commit.hash, variantIndex, eventId, content);
      },
      onAssistant: (content, variantIndex, eventId) => {
        if (!eventId) return;
        lastAssistantEventIdRef.current[variantIndex] = eventId;
        startAgentEvent(commit.hash, variantIndex, {
          id: eventId,
          type: "assistant",
          status: "running",
          startedAt: Date.now(),
        });
        appendAgentEventContent(commit.hash, variantIndex, eventId, content);
      },
      onToolStart: (data, variantIndex, eventId) => {
        if (!eventId) return;
        const lastThinking = lastThinkingEventIdRef.current[variantIndex];
        if (lastThinking && lastThinking !== eventId) {
          finishThinkingEvent(variantIndex, "complete");
        }
        const lastAssistant = lastAssistantEventIdRef.current[variantIndex];
        if (lastAssistant && lastAssistant !== eventId) {
          finishAssistantEvent(variantIndex, "complete");
        }
        startAgentEvent(commit.hash, variantIndex, {
          id: eventId,
          type: "tool",
          status: "running",
          toolName: data?.name,
          input: data?.input,
          startedAt: Date.now(),
        });
        lastToolEventIdRef.current[variantIndex] = eventId;
      },
      onToolResult: (data, variantIndex, eventId) => {
        if (!eventId) return;
        finishAgentEvent(commit.hash, variantIndex, eventId, {
          status: data?.ok === false ? "error" : "complete",
          output: data?.output,
          endedAt: Date.now(),
        });
        if (lastToolEventIdRef.current[variantIndex] === eventId) {
          delete lastToolEventIdRef.current[variantIndex];
        }
      },
      onCancel: (reason, errorMessage) => {
        // Close any running agent events when the socket ends without per-event
        // terminal messages, otherwise they remain stuck in "running" state.
        finishInFlightEvents(reason === "request_failed" ? "error" : "complete");

        if (reason === "request_failed" && commit.type === "ai_create") {
          const latestCreateCommit = useProjectStore.getState().commits[commit.hash];
          latestCreateCommit?.variants.forEach((variant, variantIndex) => {
            if (variant.status === "generating") {
              updateVariantStatus(
                commit.hash,
                variantIndex,
                "error",
                errorMessage || "Generation failed. Please retry."
              );
            }
          });
          setAppState(AppState.CODE_READY);
          return;
        }

        cancelCodeGenerationAndReset(commit);
      },
      onComplete: () => {
        finishInFlightEvents("complete");
        setAppState(AppState.CODE_READY);
      },
    });
  }

  // Initial version creation
  function doCreate(
    referenceImages: string[],
    inputMode: "image" | "video",
    textPrompt: string = ""
  ) {
    // Reset any existing state
    reset();

    // Set the input states
    setReferenceImages(referenceImages);
    setInputMode(inputMode);

    // Kick off the code generation
    if (referenceImages.length > 0) {
      const media =
        inputMode === "video" ? [referenceImages[0]] : referenceImages;
      const imageAssetIds =
        inputMode === "image"
          ? registerAssetIds(
              "image",
              media,
              getAssetsById,
              upsertPromptAssets,
              nanoid
            )
          : [];
      const videoAssetIds =
        inputMode === "video"
          ? registerAssetIds(
              "video",
              media,
              getAssetsById,
              upsertPromptAssets,
              nanoid
            )
          : [];
      const variantHistory = [
        buildUserHistoryMessage(textPrompt, imageAssetIds, videoAssetIds),
      ];
      doGenerateCode({
        generationType: "create",
        inputMode,
        prompt: {
          text: textPrompt,
          images: inputMode === "image" ? media : [],
          videos: inputMode === "video" ? media : [],
        },
        variantHistory,
      });
    }
  }

  function doCreateFromText(text: string) {
    // Reset any existing state
    reset();

    setInputMode("text");
    setInitialPrompt(text);
    doGenerateCode({
      generationType: "create",
      inputMode: "text",
      prompt: { text, images: [], videos: [] },
      variantHistory: [buildUserHistoryMessage(text)],
    });
  }

  // Subsequent updates
  async function doUpdate(updateInstruction: string) {
    if (updateInstruction.trim() === "") {
      toast.error("Please include some instructions for AI on what to update.");
      return;
    }

    if (head === null) {
      toast.error(
        "No current version set. Contact support or open a Github issue."
      );
      throw new Error("Update called with no head");
    }

    const currentCommit = commits[head];
    const currentCode =
      currentCommit?.variants[currentCommit.selectedVariantIndex]?.code || "";
    const optionCodes = currentCommit?.variants.map(
      (variant) => variant.code || ""
    );

    let modifiedUpdateInstruction = updateInstruction;
    let selectedElementHtml: string | undefined;

    // Send in a reference to the selected element if it exists
    if (selectedElement) {
      const elementHtml = removeHighlight(selectedElement).outerHTML;
      selectedElementHtml = elementHtml;
      modifiedUpdateInstruction =
        updateInstruction +
        " referring to this element specifically: " +
        elementHtml;
      setSelectedElement(null);
    }

    const selectedVariant = currentCommit.variants[currentCommit.selectedVariantIndex];
    const baseVariantHistory = selectedVariant.history;
    const updateImageAssetIds = registerAssetIds(
      "image",
      updateImages,
      getAssetsById,
      upsertPromptAssets,
      nanoid
    );
    const updatedVariantHistory = [
      ...cloneVariantHistory(baseVariantHistory),
      buildUserHistoryMessage(modifiedUpdateInstruction, updateImageAssetIds),
    ];
    const shouldBootstrapFromFileState =
      baseVariantHistory.length === 0 && currentCode.trim().length > 0;
    const updatedHistory = shouldBootstrapFromFileState
      ? []
      : toRequestHistory(updatedVariantHistory, getAssetsById);

    doGenerateCode({
      generationType: "update",
      inputMode,
      prompt: {
        text: updateInstruction,
        images: updateImages,
        videos: [],
        selectedElementHtml,
      },
      history: updatedHistory,
      optionCodes,
      variantHistory: updatedVariantHistory,
      fileState: currentCode
        ? {
            path: "index.html",
            content: currentCode,
          }
        : undefined,
    });
  }

  function setStack(stack: Stack) {
    setSettings((prev) => ({
      ...prev,
      generatedCodeConfig: stack,
    }));
  }

  function importFromCode(code: string, stack: Stack) {
    // Reset any existing state
    reset();

    // Set up this project
    setStack(stack);

    // Create a new commit and set it as the head
    const commit = createCommit({
      type: "code_create",
      parentHash: null,
      variants: [{ code, history: [] }],
      inputs: null,
    });
    addCommit(commit);
    setHead(commit.hash);

    // Set the app state
    setAppState(AppState.CODE_READY);
  }

  const showContentPanel =
    appState === AppState.CODING ||
    appState === AppState.CODE_READY ||
    isHistoryOpen;
  const isCodingOrReady =
    appState === AppState.CODING || appState === AppState.CODE_READY;
  const showMobileChatPane = showContentPanel && mobilePane === "chat";

  return (
    <div
      className={`mesh-bg bg-white dark:bg-zinc-950 text-gray-900 dark:text-white ${
        appState === AppState.CODING || appState === AppState.CODE_READY
          ? "flex h-dvh flex-col overflow-hidden lg:block lg:h-screen"
          : "min-h-screen"
      }`}
    >
      {/* Icon strip - always visible */}
      <div
        className="sticky top-0 z-50 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-12 lg:flex-col"
      >
        <IconStrip
          isHistoryOpen={isHistoryOpen}
          isEditorOpen={!isHistoryOpen && !isSettingsOpen}
          isSettingsOpen={isSettingsOpen}
          showHistory={true}
          showEditor={isCodingOrReady}
          isDark={appTheme === AppTheme.DARK || (appTheme === AppTheme.SYSTEM && window.matchMedia("(prefers-color-scheme: dark)").matches)}
          onToggleHistory={() => {
            setIsHistoryOpen((prev) => !prev);
            setIsSettingsOpen(false);
            setMobilePane("chat");
          }}
          onToggleEditor={() => {
            setIsHistoryOpen(false);
            setIsSettingsOpen(false);
            setMobilePane("preview");
          }}
          onNewProject={() => {
            reset();
            setIsHistoryOpen(false);
            setIsSettingsOpen(false);
            setMobilePane("preview");
          }}
          onOpenSettings={() => {
            setIsSettingsOpen((prev) => !prev);
            setIsHistoryOpen(false);
          }}
          onToggleTheme={() => {
            const currentlyDark = appTheme === AppTheme.DARK || (appTheme === AppTheme.SYSTEM && window.matchMedia("(prefers-color-scheme: dark)").matches);
            setAppTheme(currentlyDark ? AppTheme.LIGHT : AppTheme.DARK);
          }}
        />
      </div>

      {isCodingOrReady && !isSettingsOpen && (
        <div className="border-b border-gray-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <div className="grid grid-cols-2 rounded-xl bg-gray-100 p-0.5 dark:bg-zinc-800">
            <button
              onClick={() => {
                setIsHistoryOpen(false);
                setMobilePane("preview");
              }}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                mobilePane === "preview"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-gray-500 dark:text-zinc-400"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setMobilePane("chat")}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                mobilePane === "chat"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-gray-500 dark:text-zinc-400"
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      )}

      {/* Content panel - shows sidebar, history, or editor */}
      <AnimatePresence>
      {showContentPanel && !isSettingsOpen && (
        <m.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
          className={`border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white lg:fixed lg:inset-y-0 lg:left-12 lg:z-40 lg:flex lg:w-[25rem] lg:flex-col lg:border-b-0 lg:border-r ${
            showMobileChatPane ? "block" : "hidden lg:flex"
          }`}
        >
            <AnimatePresence mode="wait">
            {isHistoryOpen ? (
              <m.div
                key="history"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="flex-1 overflow-y-auto sidebar-scrollbar-stable px-4"
              >
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">Versions</h2>
                    <button
                      onClick={() => setIsHistoryOpen(false)}
                      className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      <LuChevronLeft className="w-3.5 h-3.5" />
                      Back to Editor
                    </button>
                  </div>
                  <HistoryDisplay />
                </div>
              </m.div>
            ) : (
              <m.div
                key="sidebar"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="flex flex-1 flex-col"
              >
                {(appState === AppState.CODING ||
                  appState === AppState.CODE_READY) && (
                  <Sidebar
                    showSelectAndEditFeature={showSelectAndEditFeature}
                    doUpdate={doUpdate}
                    regenerate={regenerate}
                    cancelCodeGeneration={cancelCodeGeneration}
                    onOpenVersions={() => {
                      setIsHistoryOpen(true);
                      setMobilePane("chat");
                    }}
                  />
                )}
              </m.div>
            )}
            </AnimatePresence>
        </m.div>
      )}
      </AnimatePresence>

      <main
        onClick={() => { if (isSettingsOpen) setIsSettingsOpen(false); }}
        className={`${
          isSettingsOpen
            ? "flex flex-1 min-h-0 flex-col lg:h-full lg:pl-12"
            : showContentPanel
              ? "flex flex-1 min-h-0 flex-col lg:h-full lg:pl-[28rem]"
              : "lg:pl-12"
        } ${isCodingOrReady && !isSettingsOpen && mobilePane === "chat" ? "hidden lg:flex" : ""}`}
      >
        <AnimatePresence mode="wait">
        {isSettingsOpen ? (
          <m.div
            key="settings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-1 flex-col min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsTab
              settings={settings}
              setSettings={setSettings}
              appTheme={appTheme}
              setAppTheme={setAppTheme}
              onBack={() => setIsSettingsOpen(false)}
            />
          </m.div>
        ) : (
          <>
            {appState === AppState.INITIAL && (
              <m.div
                key="start"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-1 flex-col min-h-0"
              >
                <StartPane
                  doCreate={doCreate}
                  doCreateFromText={doCreateFromText}
                  importFromCode={importFromCode}
                  settings={settings}
                  setSettings={setSettings}
                />
              </m.div>
            )}

            {isCodingOrReady && (
              <m.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col min-h-0"
              >
                <PreviewPane
                  settings={settings}
                  onOpenVersions={() => {
                    setIsHistoryOpen(true);
                    setMobilePane("chat");
                  }}
                />
              </m.div>
            )}
          </>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
