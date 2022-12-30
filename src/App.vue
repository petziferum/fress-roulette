<template>
  <v-app>
    <side-bar></side-bar>
    <v-main>
      <router-view/>
    </v-main>
    <v-footer>
      <div class="ml-12">
      <div v-if="isLoggedIn">Angemeldet</div>
      <div v-else>Nicht angemeldet</div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import {defineComponent, onMounted, ref} from 'vue'
import SideBar from "@/components/SideBar.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";

let auth;
const isLoggedIn = ref(false);

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) =>{
    if(user) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  })
})
</script>
