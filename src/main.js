// 确保全局对象可用
window.global = window;

// 导入 shim 以提供 Buffer 和 process
import "../shim";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// 导入Buffer polyfill
import { Buffer } from "buffer";
// 将Buffer附加到全局对象
window.Buffer = Buffer;

const app = createApp(App);
app.use(router);
app.mount("#app");
