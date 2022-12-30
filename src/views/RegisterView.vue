<template>
  <v-toolbar>
    <v-toolbar-title>Registrieren</v-toolbar-title>
    <v-row justify="center">
      <v-col>
        <v-btn variant="outlined" @click="registerWithGoogle">Mit Google anmelden</v-btn>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import router from "@/router";
const registerWithGoogle = () => {
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("result", result.user);
      router.push("/about");
    })
    .catch((error) => {
      console.error("Fehler", error.message);
    });
};
</script>

<style scoped></style>
