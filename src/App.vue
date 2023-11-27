<template>
  <v-app>
    <app-header />
    <side-bar></side-bar>
    <v-main>
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

onBeforeMount(() => {
  let auth = getAuth();
  const userState = useUserStore();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
    userState.setUserFirestoreData(user);
  });
});
</script>
