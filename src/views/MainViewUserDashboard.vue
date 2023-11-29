<template>
  <v-container fluid class="pa-0 mx-4">
    <v-toolbar style="text-align: center">
      <v-toolbar-title>User Dashboard</v-toolbar-title>
      <v-toolbar-items>
        <v-btn variant="outlined" size="small" @click="logOut">logout</v-btn>
        <v-spacer />
        <add-recipe-dialog :user="user" />
      </v-toolbar-items>
    </v-toolbar>
    <v-row class="mt-12" justify="center">
      <v-col cols="12">
        <v-card elevation="6" color="secondary">
          <v-card-subtitle class="pa-5"
            >{{ user.displayName }} - Eingelogged: {{ loggedIn }}<br />
            <p>userError: {{ userState.userError }}</p>
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
              <template v-if="user">
                <v-btn @click="logOut" variant="text">logout</v-btn>
              </template>
              <template v-else>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>User Login</v-list-item-title>
                    <v-list-item-subtitle
                      >passwort eingeben</v-list-item-subtitle
                    >
                  </v-list-item>
                </v-list>
              </template>
            </v-col>
            <v-col cols="8">
              <div>
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
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Deine Rezepte
            <v-spacer />
            <v-btn @click="fetchRecipes">Lade Rezepte</v-btn></v-card-title
          >
          <RecipeDataTable :items="userRecipes" @editRecipe="editRecipe" />
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
import { useUserStore } from "@/stores/useUserStore";
import WrapperPanel from "@/components/componenttest/WrapperPanel.vue";
import RecipeDataTable from "@/components/RecipeDataTable.vue";

const router = useRouter();
const alert = ref(false);
const alertMessage = ref<string | null>(null);
const passField = ref();
const userRecipes = ref<Recipe[]>([]);
const editRoute = ref("/recipe/edit/");
const userState = useUserStore();

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

function fetchRecipes(): void {
  userRecipes.value = [];
  getUserRecipe().then((recipes) => (userRecipes.value = recipes));
}
function editRecipe(id: string): void {
  router.push(editRoute.value + id);
}

onBeforeMount(() => {
  getUserRecipe().then((recipes) => (userRecipes.value = recipes));
});
</script>

<style scoped></style>
