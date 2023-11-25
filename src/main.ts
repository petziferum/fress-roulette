import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";

const pinia = createPinia();
loadFonts();
/*
createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .mount("#app");
*/

const app = createApp(App);
app.config.errorHandler = (err, vm, info) => {
  console.error(`Error: ${err.toString()}\nInfo: ${info}`);
};
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount("#app");
