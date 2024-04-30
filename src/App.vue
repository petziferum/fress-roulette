<template>
  <v-app>
    <app-header style="position: relative; z-index: 10" />
    <side-bar></side-bar>
    <v-main
      :style="{ 'background-image': 'url(' + stone + ')' }"
      class="background"
    >
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <router-view />
        </v-col>
      </v-row>
    </v-main>
    <v-footer class="flex-column" border>
      <div v-if="isLoggedIn">Angemeldet</div>
      <div v-else>Nicht angemeldet</div>
      <div class="px-4 py-2 bg-black text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Petziferum</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import SideBar from "@/components/AppDrawer.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppHeader from "@/components/AppHeader.vue";
import { useUserStore } from "@/stores/useUserStore";

const isLoggedIn = ref(false);
const stone =
  "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2Fbricks-3592117_1920.jpg?alt=media&token=84c59e67-cc3c-4028-8d33-2ba10b641de5";

onBeforeMount(() => {
  let auth = getAuth();
  const userState = useUserStore();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
    userState.setUserFirestoreData(user);
  });
});
</script>
<style>
.background {
  transform: translate(0, -100px);
  background-size: cover;
  background-repeat: repeat-y;
  background-position: center center;
  background-attachment: fixed;
  background-color: #080c13;
}
</style>
