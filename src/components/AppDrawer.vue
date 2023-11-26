<template>
  <v-navigation-drawer v-model="drawerState" :temporary="true" order="2">
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
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useAppStore } from "@/stores/appStore";
import { userStore } from "@/stores/userStore";

const appStore = useAppStore();
const userState = userStore();
const user = ref(userState.getStoreUser());
const drawerState = computed({
  get: () => appStore.drawer,
  set: (value) => (appStore.drawer = value),
});
watch(user, (newValue, oldValue) => {
  console.log("watch user", newValue, oldValue);
});
const listItems = computed(() => {
  console.log("storeuser drawer", user.value);
  return appStore.getAllDrawerItems().filter((item) => {
    return (user.value != null) === item.show;
  });
});
</script>

<style scoped></style>
