<template>
  <v-app-bar
    flat
    order="1"
    height="200"
    :image="barImg"
    class="align-content-center text-white"
  >
    <v-app-bar-nav-icon
      variant="tonal"
      style="position: relative; z-index: 30"
      @click.stop="drawer = !drawer"
    />
    <img
      alt="titleImg"
      :src="titleImg"
      class="pa-10 ma-10 titleImg"
      @click="router.push({ name: 'home' })"
    />
    <div class="subtitleContainer">
    <div class="subtitle">
      Das Rad entscheidet,<br />
      was wir als nächstes fressen!
    </div>
    </div>
    <v-spacer />
    <template v-slot:extension>
      <v-toolbar style="z-index: 0">
        <v-toolbar-items>
          <v-btn @click="$router.push({ name: 'Home' })"> Home </v-btn>
          <v-btn
            v-if="userLoggedIn"
            @click="router.push({ name: 'userdashboard' })"
            ><v-icon color="green">mdi-account</v-icon></v-btn
          >
          <v-btn
            v-else
            @click="router.push({ name: 'login' })"
            color="red"
            append-icon="mdi-robot-dead"
            >login</v-btn
          >
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

const barImg =
  "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2F0d8f50f4-d9e3-4184-a9eb-09ad7f429ade.webp?alt=media&token=b1ff0cdc-9973-4ee9-b103-ecde22cbe5e7";
const titleImg =
  "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/images%2Ffress-roulette-logo02.png?alt=media&token=e69e0f23-7f8c-40a6-9532-24a62495d1da";
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
  vertical-align: middle;
  padding: 12px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 7px 7px 20px rgba(252, 185, 15, 0.5);
  border-radius: 10px;
  margin: 0;
  padding: 0;
  font-weight: bolder;
  overflow: visible;
}
.titleImg {
  position: fixed;
  cursor: pointer;
  top: -35%;
  right: -50px;
  transform: rotate(20deg);
  padding: 0;
  margin: 0;
  z-index: 10;
  width: 400px;
}
@media (max-width: 600px) {
  .titleImg {
    width: 300px;
  }
}
.subtitleContainer {
  position: absolute;
  display: flex;
  z-index: 20;
  width: 100%;
  height: 100%;
  text-align: center;
  border: 1px solid red;
}
.subtitle {
  position: relative;
  z-index: 20;
  transform: translate(0, 0);
  font-size: 1.5rem;
  font-weight: bolder;
  color: #ffffff;
  text-shadow: 5px 5px 10px rgba(0, 0, 0, 1);
  border: 1px solid green;
}
@media (max-width: 600px) {
  .subtitle {
    font-size: 1rem;
    align-self: flex-end;
  }
}
</style>
