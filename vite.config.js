import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    https: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      buffer: "buffer",
      process: "process/browser",
      stream: "stream-browserify",
    },
    dedupe: ["buffer", "process"],
  },
  define: {
    // 提供 Node.js 模拟环境
    "process.env": {},
    // 明确定义 global 作为 window
    global: "window",
    // 定义 __dirname 和 __filename
    __dirname: JSON.stringify(""),
    __filename: JSON.stringify(""),
  },
  optimizeDeps: {
    esbuildOptions: {
      // 启用内置Node.js模块的polyfill
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer", "process", "stream-browserify"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
