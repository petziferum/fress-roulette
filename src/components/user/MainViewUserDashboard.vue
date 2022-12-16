<template>
  <v-row class="mt-12" justify="center">
    <v-col cols="6">
      <v-card elevation="6" color="secondary">
        <v-card-subtitle class="pa-5"
          >{{ userName }} - <v-btn @click="login" outline>login</v-btn>
          <v-btn class="mx-2" @click="logout">logout</v-btn></v-card-subtitle
        >
        <v-row>
          <v-col cols="4">
            <v-list>
              <v-list-item>
                <v-list-item-title>User Login</v-list-item-title>
                <v-list-item-subtitle>passwort eingeben</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="8">
            <div v-if="!loggedIn">
              <v-text-field
                label="passwort"
                @click="addUsername"
              ></v-text-field>
            </div>
            <div v-else>
              <v-alert height="50%">angemeldet als {{ fu }}</v-alert>
            </div>
          </v-col>
        </v-row>
        <v-card-actions>
          <div class="text-caption">
            https://learnvue.co/tutorials/vue-firebase-authentication
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";


// Todo: Typing ref Values
const userName = ref<string | null>("Offline");
const loggedIn = ref(false);
const auth = getAuth();
let fu = ref<string|null>(null);

function login() {
  signInWithEmailAndPassword(auth, "petziferum@gmail.com", "testtest")
    .then((credentials) => {
      const fireUser = credentials.user;
      fu.value = fireUser.email;
      loggedIn.value = true;
      userName.value = fireUser.email;
      console.log(fireUser);
    })
    .catch((error) => {
      console.log("error", error);
    });
}

const logout = () => {
  signOut(auth).then(() => {
    loggedIn.value = false;
    userName.value = "Nicht angemeldet";
  });
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Authstate angemeldet", user.uid);
      fu.value = user.email;
      userName.value = user.uid;
      loggedIn.value = true;
    } else {
      userName.value = "Nicht angemeldet";
      loggedIn.value = false;
    }
  });
});
</script>

<style scoped></style>
