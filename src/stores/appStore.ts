import { defineStore } from "pinia";
import { useDisplay } from "vuetify";
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/useUserStore";

export const useAppStore = defineStore("app", () => {
  const drawer = ref(true);
  const { mobile } = useDisplay();
  const listItems = ref([
    {
      title: "Home",
      path: "/",
      icon: "mdi-home",
      subtitle: "Startseite",
      show: true,
    },
    {
      title: "Roulette",
      path: "/roulette",
      icon: "mdi-circle",
      subtitle: "friss du fette Sau!",
      show: true,
    },
    {
      title: "Login",
      path: "/login",
      icon: "mdi-account",
      subtitle: "login",
      show: false,
    },
    { title: "About", to: "/about", icon: "mdi-head", subtitle: "Über mich" },
    {
      title: "DevTest",
      path: "/dev/test",
      icon: "mdi-test-tube",
      subtitle: "Test",
      show: true,
    },
    {
      title: "User Dashboard",
      path: "/user/dashboard",
      icon: "mdi-kangaroo",
      subtitle: "dashboard",
      show: true,
    },
    {
      title: "Logout",
      path: "/logout",
      icon: "mdi-logout",
      subtitle: "logout",
      show: true,
    },
  ]);
  function setDrawer() {
    drawer.value = !drawer.value;
  }

  const getDrawerItems = computed(async () => {
    const userState = useUserStore();
    console.log("store user: ", userState.userFirestoreData);
    if (userState.getStoreUser()) {
      console.log("logged in true", userState.getStoreUser().name);
      return listItems.value.filter((item) => item.show);
    } else {
      return listItems.value.filter((item) => {
        console.log("show", item.show);
        return item.show === false || item.show === undefined;
      });
    }
  });

  const getAllDrawerItems = () => {
    return listItems.value;
  };

  return { drawer, setDrawer, mobile, getDrawerItems, getAllDrawerItems };
});
