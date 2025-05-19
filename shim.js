/* eslint-disable no-undef */
import process from "process";
import { Buffer } from "buffer";

// 全局变量设置
if (typeof window !== "undefined") {
  window.global = window;
}

if (typeof global !== "undefined") {
  if (typeof global.__dirname === "undefined") global.__dirname = "/";
  if (typeof global.__filename === "undefined") global.__filename = "";

  if (typeof global.process === "undefined") {
    global.process = process;
  } else {
    // 合并属性
    for (const p in process) {
      if (!(p in global.process)) {
        global.process[p] = process[p];
      }
    }
  }

  global.process.browser = true;

  if (typeof global.Buffer === "undefined") {
    global.Buffer = Buffer;
  }
}

// 开发环境设置
const isDev = process.env.NODE_ENV !== "production";
if (typeof localStorage !== "undefined") {
  localStorage.debug = isDev ? "*" : "";
}
