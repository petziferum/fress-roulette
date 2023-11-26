<template>
  <VNavigationDrawer v-model="drawerState" temporary order="2">
    <v-list>
      <v-list-item
        link
        v-for="item in listItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.path"
      />
    </v-list>
  </VNavigationDrawer>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { userStore } from "@/stores/userStore";

const appStore = useAppStore();
const userState = userStore();
const drawerState = computed({
  get: () => appStore.drawer,
  set: (value) => (appStore.drawer = value),
});

const listItems = computed(() => {
  console.log("storeuser drawer", userState.getStoreUser());
  return appStore.getAllDrawerItems().filter((item) => {
    return (userState.getStoreUser() != null) === item.show;
  });
});
</script>

<style scoped></style>
