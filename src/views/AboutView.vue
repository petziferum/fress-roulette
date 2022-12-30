<template>
  <div class="about">
    <v-row>
      <v-col cosl="6">
        <h1 class="ma-5">This is an about page</h1>
        <v-spacer />
        <v-btn @click="logOut">Logout</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="4" class="align-center">
        <v-img :src="user.photoURL" width="120px"></v-img>
      </v-col>
      <v-col cols="12" md="4">User: {{ user }} </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import { computed } from "vue";
import firebase from "firebase/compat";
import router from "@/router";

const user = computed(() => {
  const user = getAuth().currentUser;
  if (user) {
    return user;
  } else {
    return onAuthStateChanged(getAuth(), (user) => {
      return user;
    });
  }
});

function logOut() {
  const auth = getAuth();
 signOut(auth).then(() => {
  router.push("/")
 })
}
</script>
<style></style>
