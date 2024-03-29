import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const pinia = createPinia();
loadFonts();

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
  console.error(`Error: ${err.toString()}\nInfo: ${info}`);
};

app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: "colored",
} as ToastContainerOptions);
app.mount("#app");
