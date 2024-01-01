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
.itemslide {
  transition: transform 0.3s ease-in-out, background-image 0.3s ease-in-out;
}

.itemslide:hover {
  transition: transform 0.3s ease-in-out;
  transform: translateX(10px);
  background-image: radial-gradient(
    ellipse at center,
    rgba(95, 202, 193, 0.5) 0%,
    rgba(255, 255, 255, 0.9) 70%
  );
}

</style>
