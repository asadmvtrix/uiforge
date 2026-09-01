import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: "/",
    plugins: [
      react(),
      createHtmlPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (
              id.includes("@codemirror") ||
              id.includes("@lezer") ||
              id.includes("/codemirror/")
            ) {
              return "codemirror";
            }
            if (
              id.includes("react-syntax-highlighter") ||
              id.includes("thememirror")
            ) {
              return "code-highlighting";
            }
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("@radix-ui")) return "radix";
            if (id.includes("html2canvas")) return "screenshot";
            if (id.includes("react-icons")) return "icons";
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router") ||
              id.includes("/scheduler/") ||
              id.includes("/zustand/")
            ) {
              return "react";
            }
            if (
              id.includes("react-markdown") ||
              id.includes("/remark-") ||
              id.includes("/rehype-") ||
              id.includes("/unified/") ||
              id.includes("/vfile") ||
              id.includes("/mdast-") ||
              id.includes("/hast-") ||
              id.includes("/micromark")
            ) {
              return "markdown";
            }
            return "vendor";
          },
        },
      },
    },
  });
};
