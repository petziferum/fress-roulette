<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="4" style="text-align: center">
        <v-card>
          <v-card-text>
            <v-form ref="loginform">
              <v-text-field label="Email" />
              <v-text-field label="passwort" type="password" />
              <v-btn>Login</v-btn>
            </v-form>
          </v-card-text>
          <v-card-text>
            <v-btn variant="outlined" @click="registerWithGoogle">Login mit Google</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
