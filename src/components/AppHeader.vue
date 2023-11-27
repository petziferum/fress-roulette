<template>
  <v-app-bar
    flat
    order="1"
    height="200"
    :image="barImg"
    class="align-content-center text-white"
  >
    <v-app-bar-nav-icon variant="tonal" @click.stop="drawer = !drawer" />
    <v-spacer />
    <v-sheet class="myTitleBar">
      <v-img
        :src="titleImg"
        class="pa-10 ma-10"
        height="150px"
        style="cursor: pointer"
        @click="router.push({ name: 'home' })"
      />
      <div class="subtitle">Das Rad entscheidet, was wir als nächstes fressen!</div>
    </v-sheet>
    <v-spacer />
    <template v-slot:extension>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn @click="$router.push({ name: 'Home' })"> Home </v-btn>
          <v-btn v-if="userLoggedIn" @click="router.push({name: 'userdashboard'})"><v-icon color="green">mdi-account</v-icon></v-btn>
          <v-icon v-else color="red">mdi-robot-dead</v-icon>
        </v-toolbar-items>
      </v-toolbar>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useDisplay } from "vuetify";
import router from "@/router";
import { useUserStore } from "@/stores/useUserStore";

const barImg = "/src/assets/whisky.jpg";
const titleImg = "/src/assets/TITLE.png";
const store = useAppStore();
const userStore = useUserStore();
const userLoggedIn = computed(() => {
  return userStore.userLoggedIn;
});

const drawer = computed({
  get: () => store.drawer,
  set: (value) => (store.drawer = value),
});

const mobile = computed(() => {
  return store.mobile;
});
</script>

<style scoped>
.myTitleBar {
  display: table;
  vertical-align: middle;
  padding: 12px;
  height: 80%;
  width: 50%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 7px 7px 20px rgba(252, 185, 15, 0.5);
  border-radius: 10px;
  font-weight: bolder;
}
.subtitle {
  position: relative;
  top: -60px;
  font-size: 1.2rem;
  font-weight: bolder;
  color: #222222;
  text-shadow: 0 1px 5px rgba(153, 210, 10, 0.9);
}
</style>
