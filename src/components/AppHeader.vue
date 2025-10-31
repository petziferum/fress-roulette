<template>
  <v-toolbar class="toolb" :image="barImg">
    <div class="subtitleContainer">
      <div class="subtitle">
        Das Rad entscheidet,<br />
        was wir als nächstes fressen!
      </div>
    </div>
    <template v-slot:extension>
      <v-toolbar-items>
        <v-btn
          @click="$router.push({ name: 'Home' })"
          style="opacity: 0.5"
          variant="flat"
        >
          Home
        </v-btn>
        <v-btn
          @click="router.push({ name: 'Pricetag' })"
          style="opacity: 0.5"
          variant="flat"
        >
          Pricetag
        </v-btn>
        <v-btn
          v-if="userLoggedIn"
          @click="router.push({ name: 'userdashboard' })"
          style="opacity: 0.5"
          variant="flat"
          ><v-icon color="green" style="opacity: 1">mdi-account</v-icon></v-btn
        >
        <v-btn
          v-else
          @click="router.push({ name: 'login' })"
          color="red"
          append-icon="mdi-robot-dead"
          >login</v-btn
        >
      </v-toolbar-items>
    </template>
  </v-toolbar>
  <img
    alt="titleImg"
    :src="titleImg"
    :class="mobile ? 'mobilePizza' : 'pizza'"
    @click.stop="drawer = !drawer"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
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
  return store.mobile
});
</script>

<style scoped>
.toolb {
  display: flex;
  position: relative;
  overflow: visible !important;
  height: 200px;
}
.toolb :deep(.v-toolbar__content) {
  overflow: visible !important;
}
.mobilePizza {
  position: absolute;
  cursor:pointer;
  top: 80px;
  right: 1%;
  transform: rotate(20deg);
  transition: transform 0.2s ease-in-out;
  z-index: 100;
  width: 30%;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
}
.pizza {
  position: absolute;
  cursor:pointer;
  top: 1%;
  right: 1%;
  transform: rotate(20deg);
  transition: transform 0.2s ease-in-out;
  z-index: 100;
  width: 200px;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
}
.pizza:hover {
  transform: rotate(-5deg) scale(1.1);
  filter: drop-shadow(8px 8px 15px rgba(0, 0, 0, 0.7));
}

@media (max-width: 600px) {
  .titleImg {
    width: 250px;
    right: -20px;
  }
}

.subtitleContainer {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1%;
  z-index: 200;
  width: 100%;
  height: 100%;
  text-align: center;
}
.subtitle {
  position: relative;
  z-index: 200;
  transform: translate(0, 0);
  font-size: 1.5rem;
  font-weight: bolder;
  color: #ffffff;
  text-shadow: 5px 5px 10px rgba(0, 0, 0, 1);
}
@media (max-width: 600px) {
  .subtitle {
    font-size: 1rem;
    align-self: flex-end;
  }
}
.glowing-icon {
  margin-right: 1em;
  z-index: 30;
  transition: box-shadow 0.3s ease-in-out;
  box-shadow: 0 0 15px 10px rgba(255, 255, 255, 1),
    0 0 50px 20px rgba(255, 255, 255, 1);
}

.glowing-icon:hover {
  box-shadow: 0 0 25px 10px rgba(255, 255, 255, 1),
    0 0 20px 40px rgba(255, 255, 255, 1);
}
</style>
