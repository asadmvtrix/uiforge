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
    // Avoid aggressive manualChunks — splitting react/zustand/vendor into
    // custom bundles caused a TDZ crash in production:
    // "Cannot access '$c' before initialization" (blank white screen).
    build: {
      chunkSizeWarningLimit: 1200,
    },
  });
};
