<template>
  <v-container fluid class="pa-0">
    <v-toolbar style="text-align: center">
      <v-toolbar-title>User Dashboard</v-toolbar-title>
      <v-toolbar-items>
        <v-spacer />
        <add-recipe-dialog :user-id="user.uid" />
      </v-toolbar-items>
    </v-toolbar>
    <v-row class="mt-12" justify="center">
      <v-col cols="6">
        <v-card elevation="6" color="secondary">
          <v-card-subtitle class="pa-5"
            >{{ user.displayName }} - Eingelogged: {{ loggedIn }}
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
                <v-alert height="50%">angemeldet als {{ user.email }}</v-alert>
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
          <v-card-text v-for="recipe of userRecipes" :key="recipe.id">
            <ul>
              <li>{{ recipe }}</li>
              <li><v-btn @click="editRecipe(recipe.id)">Bearbeiten</v-btn></li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { getUserRecipe, user, logOut } from "@/plugins/firebase";
import Recipe from "@/components/Models/Recipe.class";
import { useRouter } from "vue-router";
import AddRecipeDialog from "@/components/AddRecipeDialog.vue";

// Todo: Typing ref Values
const router = useRouter();
const password = ref("");
const alert = ref(false);
const alertMessage = ref<string | null>(null);
const passField = ref();
const userRecipes = ref<Recipe[]>([]);
const editRoute = ref("/recipe/edit/");

const required = computed(() => {
  return (v: string) => !!v || "Darf nicht leer sein";
});

const loggedIn = computed(() => {
  return !!user.value;
});

async function checkIfTextfieldIsValid() {
  const valid = await passField.value.validate();
  console.log("valid?", valid[0]);
  if (!valid[0]) {
    console.log("Valide");
  } else {
    console.log("Nicht valide");
  }
}

function editRecipe(id: string): void {
  router.push(editRoute.value + id);
}

onBeforeMount(() => {
  getUserRecipe().then((recipes) => (userRecipes.value = recipes));
});
</script>

<style scoped></style>
