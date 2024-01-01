<template>
  <v-navigation-drawer v-model="drawerState" :temporary="true" order="2">
    <v-list>
      <transition-group name="slide">
        <v-list-item
          link
          class="itemslide"
          v-for="item in listItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.path"
        />
      </transition-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/useUserStore";

const appStore = useAppStore();
const userState = useUserStore();
const user = ref(userState.userFirestoreData);
const drawerState = computed({
  get: () => appStore.drawer,
  set: (value) => (appStore.drawer = value),
});
watch(user, (newValue, oldValue) => {
  console.log("watch user", user, newValue, oldValue);
});
const listItems = computed(() => {
  console.log("storeuser drawer", user.value);
  return appStore.getAllDrawerItems().filter((item) => {
    return (userState.userFirestoreData != null) === item.show;
  });
});
</script>
<style scoped>
.itemslide:hover {
  transform: translateX(10px);
  transition: transform 0.3s ease-in-out;
  background-image: linear-gradient(45deg, #ffffff 0%, #a6c1ee 51%, #ffffff 100%);
}
.itemslide {
  transition: transform 0.3s ease-in-out;
}
</style>
