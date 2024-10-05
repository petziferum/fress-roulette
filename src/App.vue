<template>
  <v-app style="background-color: red">
    <app-header/>
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
    <v-footer border>
      <v-row>
        <v-col>
          <div v-if="userStore.userLoggedIn">Angemeldet</div>
          <div v-else>Nicht angemeldet</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="px-4 py-2 bg-black text-center w-100">
            {{ new Date().getFullYear() }} — <strong>Petziferum</strong>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import SideBar from "@/components/AppDrawer.vue";
import AppHeader from "@/components/AppHeader.vue";
import { useUserStore } from "@/stores/useUserStore";

const stone =
  "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2Fbricks-3592117_1920.jpg?alt=media&token=84c59e67-cc3c-4028-8d33-2ba10b641de5";
const userStore = useUserStore();
</script>
<style>
.background {
  width: 100%;
  transform: translate(0, -100px);

  background-repeat: repeat-y;
  background-position: center;
  background-attachment: fixed;
  background-color: #080c13;
}
</style>
