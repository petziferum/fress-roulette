import { createApp, onBeforeMount } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userStore } from "@/stores/userStore";

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
app.runWithContext(() => {
  const userState = userStore();
  onAuthStateChanged(getAuth(), (user) => {
    console.log("MAIN.TS: storeUser: ", userState.userFirestoreData.value);
    if (user) {
      console.log("User is logged in", user.displayName);
      if(userState.userFirestoreData.value === null) {
        userState.userFirestoreData.value = {};
      }
      userState.userFirestoreData.value = user;
    } else {
      console.log("User is logged out");
    }
  });
});
app.mount("#app");
