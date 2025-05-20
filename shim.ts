// 导入需要的模块
import process from "process";
import { Buffer } from "buffer";

// 全局变量设置
declare global {
  interface Window {
    global: typeof globalThis;
  }

  var global: typeof globalThis;
  var __dirname: string;
  var __filename: string;
}

if (typeof window !== "undefined") {
  window.global = window;
}

if (typeof global !== "undefined") {
  if (typeof global.__dirname === "undefined") global.__dirname = "/";
  if (typeof global.__filename === "undefined") global.__filename = "";

  if (typeof global.process === "undefined") {
    (global as any).process = process;
  } else {
    // 合并属性
    for (const p in process) {
      if (!(p in global.process)) {
        (global.process as any)[p] = (process as any)[p];
      }
    }
  }

  (global.process as any).browser = true;

  if (typeof global.Buffer === "undefined") {
    (global as any).Buffer = Buffer;
  }
}

// 开发环境设置
const isDev = process.env.NODE_ENV !== "production";
if (typeof localStorage !== "undefined") {
  localStorage.debug = isDev ? "*" : "";
}
