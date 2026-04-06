import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/landing/LandingPage.tsx";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";

// Lazy-load heavy routes so they don't block initial paint
const App = lazy(() => import("./App.tsx"));
const AllEvalsPage = lazy(() => import("./components/evals/AllEvalsPage.tsx"));
const EvalsPage = lazy(() => import("./components/evals/EvalsPage.tsx"));
const PairwiseEvalsPage = lazy(() => import("./components/evals/PairwiseEvalsPage"));
const RunEvalsPage = lazy(() => import("./components/evals/RunEvalsPage.tsx"));
const BestOfNEvalsPage = lazy(() => import("./components/evals/BestOfNEvalsPage.tsx"));
const OpenAIInputComparePage = lazy(() => import("./components/evals/OpenAIInputComparePage.tsx"));

const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <m.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <img
          src="/favicon/main.png"
          alt=""
          className="h-8 w-8 dark:invert animate-pulse"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Loading studio
          </span>
          <span className="inline-flex gap-0.5">
            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce [animation-duration:800ms]" />
            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce [animation-duration:800ms] [animation-delay:150ms]" />
            <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce [animation-duration:800ms] [animation-delay:300ms]" />
          </span>
        </div>
      </m.div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="min-h-screen"
      >
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/studio" element={<App />} />
            <Route path="/evals" element={<AllEvalsPage />} />
            <Route path="/evals/single" element={<EvalsPage />} />
            <Route path="/evals/pairwise" element={<PairwiseEvalsPage />} />
            <Route path="/evals/best-of-n" element={<BestOfNEvalsPage />} />
            <Route path="/evals/run" element={<RunEvalsPage />} />
            <Route
              path="/evals/openai-input-compare"
              element={<OpenAIInputComparePage />}
            />
          </Routes>
        </Suspense>
      </m.div>
    </AnimatePresence>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <LazyMotion features={domAnimation} strict>
        <AnimatedRoutes />
      </LazyMotion>
    </Router>
    <Toaster toastOptions={{ className: "dark:bg-zinc-950 dark:text-white" }} />
  </React.StrictMode>
);
