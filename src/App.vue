<template>
  <v-app>
    <app-header />
    <side-bar></side-bar>
    <v-main>
      <v-row>
        <v-col cols="12" md="3"></v-col>
        <v-col cols="12" md="6">
          <router-view />
        </v-col>
        <v-col cols="12" md="12"></v-col>
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
import SideBar from "@/components/SideBar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppHeader from "@/components/AppHeader.vue";

let auth;
const isLoggedIn = ref(false);

onBeforeMount(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
    console.log("isloggedin", isLoggedIn.value);
  });
});
</script>
