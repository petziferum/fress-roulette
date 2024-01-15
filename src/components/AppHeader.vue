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
        class="pa-10 ma-10 titleImg"
        height="250px"
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
          <v-btn v-else @click="router.push({ name: 'login' })" color="red" append-icon="mdi-robot-dead">login</v-btn>
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

const barImg = "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2F0d8f50f4-d9e3-4184-a9eb-09ad7f429ade.webp?alt=media&token=b1ff0cdc-9973-4ee9-b103-ecde22cbe5e7";
const titleImg = "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2Ffress-roulette-logo02.png?alt=media&token=e69e0f23-7f8c-40a6-9532-24a62495d1da";
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
.titleImg {
  margin-top: 20px;
  transform: translatey(40px);
  vertical-align: middle;
  height: 100%;
  z-index: 20;
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
