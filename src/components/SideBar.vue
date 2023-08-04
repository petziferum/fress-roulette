<template>
  <VNavigationDrawer v-model="drawerState" temporary rail order="2">
    <v-list>
      <v-list-item
        link
        v-for="item in listItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
        :to="item.to"
      />
    </v-list>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();

const drawerState = computed({
  get: () => appStore.drawer,
  set: (value) => (appStore.drawer = value),
});

const listItems = ref([
  { title: "Home", to: "/", icon: "mdi-home", subtitle: "Startseite" },
  {
    title: "Roulette",
    to: "/roulette",
    icon: "mdi-circle",
    subtitle: "friss du fette Sau!",
  },
  {
    title: "Rezepte",
    to: "/rezepte",
    icon: "mdi-food",
    subtitle: "friss du fette Sau!",
  },
  { title: "About", to: "/about", icon: "mdi-head", subtitle: "Über mich" },
  {
    title: "DevTest",
    to: "/dev/test",
    icon: "mdi-test-tube",
    subtitle: "Test",
  },
  {
    title: "User Dashboard",
    to: "/user/dashboard",
    icon: "mdi-kangaroo",
    subtitle: "dashboard",
  },
]);
</script>

<style scoped></style>
