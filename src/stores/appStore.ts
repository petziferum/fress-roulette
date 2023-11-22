import { defineStore } from "pinia";
import { useDisplay } from "vuetify";

export const useAppStore = defineStore("app", () => {
  const drawer = ref(true);
  const { mobile } = useDisplay();
  function setDrawer() {
    drawer.value = !drawer.value;
  }



  return { drawer, setDrawer, mobile };
});