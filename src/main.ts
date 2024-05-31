import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/useUserStore";

const pinia = createPinia();
loadFonts();

let app: ReturnType<typeof createApp>;
const auth = getAuth();


auth.onAuthStateChanged((user) => {
  if (!app) {
    app = createApp(App);
    app.use(pinia);
    app.config.errorHandler = (err, vm, info) => {
      console.error(`Error: ${err.toString()}\nInfo: ${info}`);
    };
    app.use(router);
    app.use(vuetify);
    app.use(Vue3Toastify, {
      autoClose: 3000,
      theme: "colored",
    } as ToastContainerOptions);
    app.mount("#app");
  }
  const userStore = useUserStore();
  if (user) {
    userStore.setUserFirestoreData(user);
  } else {
    console.log("User is signed out");}
});
