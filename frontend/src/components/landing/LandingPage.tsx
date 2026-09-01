import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuGithub, LuSun, LuMoon } from "react-icons/lu";
import { m, useInView } from "framer-motion";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.97, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.12, 0.8, 0.32, 1] as const,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const stored = window.localStorage.getItem("app-theme");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed === "dark") return true;
      if (parsed === "light") return false;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    window.localStorage.setItem(
      "app-theme",
      JSON.stringify(next ? "dark" : "light")
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 antialiased">
      {/* ─── NAV ─── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-lg bg-white/85 dark:bg-zinc-950/80 border-b border-gray-200 dark:border-zinc-800/60 shadow-sm shadow-gray-200/50 dark:shadow-black/20"
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2.5 group">
            {/* Branded icon mark */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-gray-900 dark:text-white">
              UIForge
            </span>
          </a>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <LuSun className="h-3.5 w-3.5" /> : <LuMoon className="h-3.5 w-3.5" />}
            </button>
            <a
              href="https://github.com/asadmvtrix/uiforge"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
              aria-label="GitHub"
            >
              <LuGithub className="h-3.5 w-3.5" />
            </a>
            <m.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/studio")}
              className="btn-gradient-hover ml-1.5 h-7 rounded-full bg-gray-900 dark:bg-white px-3 text-xs font-medium text-white dark:text-gray-900"
            >
              Launch App
            </m.button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-10 sm:pt-44 sm:pb-14 overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-b from-indigo-300/25 via-indigo-200/10 to-transparent dark:from-indigo-500/15 dark:via-indigo-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-5">
          <div className="animate-fade-in-up flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 shadow-md shadow-gray-200/40 dark:shadow-black/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                Open source &amp; self-hosted
              </span>
            </div>

            {/* Headline */}
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Any input.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Production UI.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-500 dark:text-zinc-400">
              Drop a screenshot, record your screen, describe a UI in text, or
              import existing HTML — UIForge generates clean, responsive code in
              your chosen stack. Then click any element in the live preview to
              tweak it without touching the rest.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <m.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/studio")}
                className="btn-gradient-hover group inline-flex h-10 w-40 items-center justify-center gap-2 rounded-full bg-gray-900 dark:bg-white px-5 text-sm font-medium text-white dark:text-gray-900 shadow-sm"
              >
                Open Studio
                <LuArrowRight className="h-3.5 w-3.5 opacity-40 transition-transform duration-200 group-hover:translate-x-0.5" />
              </m.button>
              <a
                href="https://github.com/asadmvtrix/uiforge"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-hover inline-flex h-10 w-40 items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 text-sm font-medium text-gray-600 dark:text-zinc-300 shadow-sm"
              >
                <LuGithub className="h-3.5 w-3.5" />
                View Source
              </a>
            </div>
          </div>

          {/* ─── Product mockup ─── */}
          <Reveal className="mt-16 sm:mt-24">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-gray-300/60 dark:shadow-black/50 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] font-medium text-gray-400 dark:text-zinc-600">
                  UIForge Studio
                </span>
              </div>

              {/* Split: screenshot → code */}
              <div className="grid sm:grid-cols-2 min-h-[340px]">
                {/* Left */}
                <div className="flex flex-col items-center justify-center p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-zinc-800">
                  <div className="w-full max-w-[260px] aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-zinc-600">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">
                      Screenshot, recording, text, or code
                    </span>
                  </div>
                </div>

                {/* Right — code output */}
                <div className="flex flex-col justify-center p-8 sm:p-10 bg-gray-50 dark:bg-zinc-950">
                  <pre className="font-mono text-[11px] leading-[1.8] text-gray-500 dark:text-zinc-500 overflow-hidden">
                    <code>
                      <span className="text-gray-400 dark:text-zinc-600">{"<!-- Hero section -->"}</span>{"\n"}
                      <span className="text-violet-600 dark:text-violet-400">{"<section"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"relative bg-white py-24"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>{"\n"}
                      {"  "}<span className="text-violet-600 dark:text-violet-400">{"<div"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"mx-auto max-w-5xl px-6"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>{"\n"}
                      {"    "}<span className="text-violet-600 dark:text-violet-400">{"<h1"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"text-5xl font-bold tracking-tight"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>
                      <span className="text-gray-400 dark:text-zinc-600">{"..."}</span>
                      <span className="text-violet-600 dark:text-violet-400">{"</h1>"}</span>{"\n"}
                      {"    "}<span className="text-violet-600 dark:text-violet-400">{"<p"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"mt-4 text-lg text-gray-500"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>
                      <span className="text-gray-400 dark:text-zinc-600">{"..."}</span>
                      <span className="text-violet-600 dark:text-violet-400">{"</p>"}</span>{"\n"}
                      {"    "}<span className="text-violet-600 dark:text-violet-400">{"<div"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"mt-8 flex gap-3"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>{"\n"}
                      {"      "}<span className="text-violet-600 dark:text-violet-400">{"<button"}</span>
                      {" "}<span className="text-sky-600 dark:text-sky-400">{"class"}</span>
                      {"="}<span className="text-amber-600 dark:text-amber-400">{'"rounded-full bg-indigo-600 px-6"'}</span>
                      <span className="text-violet-600 dark:text-violet-400">{">"}</span>
                      <span className="text-gray-400 dark:text-zinc-600">{"..."}</span>
                      <span className="text-violet-600 dark:text-violet-400">{"</button>"}</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── INPUT MODES ─── */}
      <section className="border-t border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <Reveal>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl text-center">
              Four ways to start
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400 text-center max-w-lg mx-auto">
              Each input runs through 4 parallel AI models. You pick the best result.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Screenshot",
                d: "Paste, drag, or upload up to 5 images. The AI reads the layout, colors, and components — then writes matching code.",
              },
              {
                n: "02",
                t: "Screen recording",
                d: "Record directly from the browser. The AI watches the video frame-by-frame for multi-state context — hover states, menus, transitions.",
              },
              {
                n: "03",
                t: "Text prompt",
                d: "Describe what you want in plain English. No image needed. The AI builds the full layout from your description.",
              },
              {
                n: "04",
                t: "HTML import",
                d: "Paste existing markup. The AI modernises it into your chosen stack — Tailwind classes, proper semantics, responsive breakpoints.",
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.06}>
                <m.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="card-hover-border rounded-xl border border-gray-200/80 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-sm p-6 h-full shadow-md shadow-gray-200/40 dark:shadow-black/20 transition-shadow duration-200 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/20"
                >
                  <span className="text-[11px] font-mono text-gray-300 dark:text-zinc-700">{item.n}</span>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-zinc-100">{item.t}</p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-gray-500 dark:text-zinc-400">{item.d}</p>
                </m.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STACKS ─── */}
      <section className="border-t border-gray-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/30">
        <div className="mx-auto max-w-5xl px-5 py-14 flex flex-col sm:flex-row sm:items-center gap-6">
          <Reveal className="shrink-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              Output stacks
            </p>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-wrap gap-2">
            {[
              "HTML + Tailwind",
              "React + Tailwind",
              "Vue + Tailwind",
              "Bootstrap",
              "Ionic",
              "Angular + Material",
              "Svelte + Tailwind",
              "HTML + CSS",
            ].map((s) => (
              <span
                key={s}
                className="btn-outline-hover rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-1 text-[12px] font-medium text-gray-600 dark:text-zinc-400 cursor-default"
              >
                {s}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="border-t border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <Reveal>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              What you get
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-500 dark:text-zinc-400">
              Everything ships out of the box. Zero config, zero plugins.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "DOM-level select & edit",
                d: "Output renders in a sandboxed iframe. Click any node — the AI applies a surgical string-replace patch, not a full rewrite.",
                tag: "Core",
              },
              {
                t: "MediaRecorder capture",
                d: "Built-in screen recorder via the browser\u2019s MediaRecorder API. Frames are sampled and sent as a video stream for multi-frame context.",
                tag: "Input",
              },
              {
                t: "Parallel multi-model inference",
                d: "Fans out to 4 LLM workers \u2014 2\u00d7 Gemini Flash + 2\u00d7 Claude Sonnet. Results stream back concurrently over WebSocket.",
                tag: "Engine",
              },
              {
                t: "8 output stacks",
                d: "Tailwind, React JSX, Vue SFC, Bootstrap, Ionic, Angular + Material, Svelte, vanilla CSS. All CDN-loaded, zero build step.",
                tag: "Output",
              },
              {
                t: "Single-file artifact",
                d: "One self-contained .html with inline scripts and CDN imports. No bundler, no node_modules. Download or clipboard-copy.",
                tag: "Output",
              },
              {
                t: "Immutable commit history",
                d: "Every generation and edit creates a content-addressed commit. Browse the DAG, diff versions, or hard-reset to any state.",
                tag: "Workflow",
              },
              {
                t: "Responsive viewport preview",
                d: "Toggle 1280px desktop and 375px mobile viewports. Tailwind responsive prefixes (sm:, md:, lg:) enforced in the system prompt.",
                tag: "Preview",
              },
              {
                t: "Theme-aware generation",
                d: "The vision model reads the screenshot\u2019s color scheme. Dark UIs produce dark output \u2014 no post-processing needed.",
                tag: "Engine",
              },
              {
                t: "Stateless relay architecture",
                d: "FastAPI backend is a pure WebSocket relay. No DB, no sessions, no disk writes. API keys live in localStorage, sent per-request.",
                tag: "Infra",
              },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.04}>
                <m.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="card-hover-border rounded-xl border border-gray-200/80 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-sm p-5 h-full shadow-md shadow-gray-200/40 dark:shadow-black/20 transition-shadow duration-200 hover:shadow-md hover:shadow-gray-300/50 dark:hover:shadow-black/20"
                >
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-2">
                    {f.tag}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100 leading-snug">{f.t}</p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-gray-500 dark:text-zinc-400">{f.d}</p>
                </m.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-t border-gray-200 dark:border-zinc-800/60">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
          <Reveal>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Questions you might have
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { q: "Wait, so I don't pay you anything?", a: "UIForge is free, MIT-licensed, fully open source. You pay your AI provider directly — typically 1–5 cents per generation." },
              { q: "Gemini or Claude?", a: "Both run automatically. Flash finishes in ~20s, Sonnet in ~45s. You compare and pick. No manual model selection needed." },
              { q: "Output isn't pixel-perfect.", a: "Expected. AI nails structure and colors, but font-weight and letter-spacing need manual tweaks. Treat it as a fast first draft." },
              { q: "Can I ship this code to clients?", a: "Yes. The code is yours. No attribution, no license gotchas. Standard Tailwind HTML, nothing proprietary." },
              { q: "Where do my screenshots go?", a: "Directly to the AI provider from your browser. UIForge's server is a stateless relay — zero logging, zero storage." },
              { q: "Does it handle dark UIs?", a: "The vision model reads whatever's in the screenshot. Dark themes, gradients, glassmorphism — all work. Output matches the input theme." },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="card-hover-border rounded-xl border border-gray-200/80 dark:border-zinc-700/50 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-sm p-5 shadow-md shadow-gray-200/40 dark:shadow-black/20">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{item.q}</p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-gray-500 dark:text-zinc-400">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-gray-200 dark:border-zinc-800/60 bg-gray-50 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Try it now
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400">
              No account. No credit card. Just paste a screenshot.
            </p>
            <m.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/studio")}
              className="btn-gradient-hover group mt-7 inline-flex h-10 items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-6 text-sm font-medium text-white dark:text-gray-900 shadow-sm"
            >
              Open Studio
              <LuArrowRight className="h-3.5 w-3.5 opacity-40 transition-transform group-hover:translate-x-0.5" />
            </m.button>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-200 dark:border-zinc-800/60 shadow-[0_-1px_3px_0_rgba(0,0,0,0.03)] dark:shadow-[0_-1px_3px_0_rgba(0,0,0,0.2)]">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-5 px-5 py-7">
          <span className="text-[11px] text-gray-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} UIForge
          </span>
          <span className="h-3 w-px bg-gray-200 dark:bg-zinc-800" />
          <a
            href="https://github.com/asadmvtrix/uiforge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-zinc-600 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors"
          >
            <LuGithub className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
