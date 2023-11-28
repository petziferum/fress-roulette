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

  const getDrawerItems = computed(() => {
    const userStore = useUserStore();
    const loginItem = listItems.value.find(item => item.title === 'Login');
    const logoutItem = listItems.value.find(item => item.title === 'Logout');
    if (loginItem && logoutItem) {
      loginItem.show = !userStore.userFirestoreData.value;
      logoutItem.show = !!userStore.userFirestoreData.value;
    }
      return listItems.value.filter((item) => item.show);


  });

  const getAllDrawerItems = () => {
    return listItems.value;
  };

  return { drawer, setDrawer, mobile, getDrawerItems, getAllDrawerItems };
});
