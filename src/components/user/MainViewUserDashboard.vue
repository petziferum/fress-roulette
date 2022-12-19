<template>
  <v-row class="mt-12" justify="center">
    <v-col cols="6">
      <v-card elevation="6" color="secondary">
        <v-card-subtitle class="pa-5"
          >{{ userName }} - <v-btn @click="login" variant="tonal">login</v-btn>
          <v-btn class="mx-2" @click="logout" variant="tonal"
            >logout</v-btn
          ></v-card-subtitle
        >
        <v-card-subtitle v-if="alert">{{ alertMessage }}</v-card-subtitle>
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
            <div v-if="!loggedIn" style="display: flex; flex-direction: row">
              <v-text-field
                ref="passField"
                :rules="[required]"
                variant="outlined"
                label="passwort"
                v-model="password"
              ></v-text-field>
              <v-btn
                rounded="0"
                flat
                min-height="55"
                @click="login"
                variant="tonal"
                >login</v-btn
              >
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
import { computed, onMounted, ref } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Todo: Typing ref Values
const userName = ref<string | null>("Offline");
const loggedIn = ref(false);
const auth = getAuth();
const password = ref("");
const alert = ref(false);
const alertMessage = ref<string | null>(null);
let fu = ref<string | null>(null);
const passField = ref();
const required = computed(() => {
  return (v: string) => !!v || "Darf nicht leer sein";
});

async function login() {
  const valid = await passField.value.validate();
  console.log("valid?", valid[0]);
  if (!valid[0]) {
    console.log("Valide");
  } else {
    console.log("Nicht valide");
  }
  /*
  signInWithEmailAndPassword(auth, "petziferum@gmail.com", password.value) //testtest
    .then((credentials) => {
      const fireUser = credentials.user;
      fu.value = fireUser.email;
      loggedIn.value = true;
      userName.value = fireUser.email;
      console.log(fireUser);
    })
    .catch((error) => {
      console.log("error", error);
      alert.value = true;
      alertMessage.value = "Falsches Passowrt  -  " + error.toString();
    });
   */
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
