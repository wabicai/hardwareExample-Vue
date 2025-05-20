// 确保全局对象可用
// 使用类型断言避免TypeScript错误
(window as any).global = window;

// 导入 shim 以提供 Buffer 和 process
import "../shim.ts";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.ts";

const app = createApp(App);
app.use(router);
app.mount("#app");
