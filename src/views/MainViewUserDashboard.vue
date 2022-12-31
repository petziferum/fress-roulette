<template>
  <v-container fluid>
    <v-toolbar style="text-align: center">
      <v-toolbar-title>User Dashboard</v-toolbar-title>
    </v-toolbar>
    <v-row class="mt-12" justify="center">
      <v-col cols="6">
        <v-card elevation="6" color="secondary">
          <v-card-subtitle class="pa-5"
            >{{ userName }} -
            <v-btn @click="checkIfTextfieldIsValid" variant="tonal"
              >Validate Textfield</v-btn
            >
            <v-btn class="mx-2" @click="logOut" variant="tonal"
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
                  @click="checkIfTextfieldIsValid"
                  variant="tonal"
                  >login</v-btn
                >
              </div>
              <div v-else>
                <v-alert height="50%">angemeldet als {{ fu }}</v-alert>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-table density="compact">
                <tr v-for="(value, key) in user" :key="key">
                  <th>
                    {{ key }}
                  </th>
                  <td>
                    {{ value }}
                  </td>
                </tr>
              </v-table>
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

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Deine Rezepte
            <v-spacer />
            <v-btn @click="getUserRecipe">Lade Rezepte</v-btn></v-card-title
          >
          <v-card-text>
            {{ userRecipes }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "@/router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import Recipe, { recipeConverter } from "@/components/Models/Recipe.class";

// Todo: Typing ref Values
const userName = ref<string | null>("Offline");
const loggedIn = ref(false);
const auth = getAuth();
const password = ref("");
const alert = ref(false);
const alertMessage = ref<string | null>(null);
let fu = ref<string | null>(null);
const passField = ref();
const userRecipes = ref<Recipe[]>([]);
const required = computed(() => {
  return (v: string) => !!v || "Darf nicht leer sein";
});

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
    loggedIn.value = false;
    router.push("/");
  });
}

async function checkIfTextfieldIsValid() {
  const valid = await passField.value.validate();
  console.log("valid?", valid[0]);
  if (!valid[0]) {
    console.log("Valide");
  } else {
    console.log("Nicht valide");
  }
}

async function getUserRecipe(): Promise<void> {
  console.log("UserDashboard | getUserRecipe user:", user.value);
  if (user.value != null) {
    const userid = user.value!;
    const collectionRef = collection(db, "test");

    const q = query(
      collectionRef,
      where("createdBy", "==", userid)
    ).withConverter(recipeConverter);

    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      if (doc.exists()) {
        // Convert to City object
        const r = doc.data();
        // Use a City instance method
        userRecipes.value.push(r);
      } else {
        console.log("No such document!");
      }
    });
  } else {
    console.info("noch kein user: ", user.value);
  }
}

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
