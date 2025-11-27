<template>
  <v-container fluid class="pa-0 mx-0">
    <v-toolbar density="prominent" style="text-align: center">
      <v-toolbar-title>User Dashboard</v-toolbar-title>
      <v-toolbar-items>
        <AddJsonRecipe />
        <add-recipe-dialog :user="user" />
        <v-spacer />
      </v-toolbar-items>
    </v-toolbar>
    <v-row class="mt-12" justify="center">
      <v-col cols="12">
        <v-card elevation="6" color="secondary">
          <v-card-subtitle class="pa-5"
            >{{ user.displayName }} - Eingelogged:
            {{ userState.userLoggedIn }}<br />
            <p>userError: {{ userState.userError }}</p>
            </v-card-subtitle
          >
          <v-card-subtitle v-if="alert">{{ alertMessage }}</v-card-subtitle>
          <v-row>
            <v-col cols="8">
              <div>
                <v-alert height="50%">angemeldet als {{ user.email }}</v-alert>
              </div>
            </v-col>
            <v-col>
              <v-btn class="mx-2" @click="logOut" variant="tonal" block height="100%"
              >logout</v-btn
              >
            </v-col>
          </v-row>
          <v-row ref="Userdaten">
            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>Daten</v-expansion-panel-title>
                  <v-expansion-panel-text>
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
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
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
            Rezepte
          </v-card-title
          >
          <v-card-subtitle class="pa-5">
            <v-btn @click="fetchRecipes">Lade Rezepte</v-btn>
            <v-text-field
              id="rezeptsuche"
              v-model="searchQuery"
              label="Rezeptsuche"
              placeholder="z.B. Burrito, Carbonara ..."
              clearable
              hide-details
            ></v-text-field>
          </v-card-subtitle>
          <RecipeDataTable
            :userRecipes="filteredRecipes"
            @editRecipe="editRecipe"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { getUserRecipe, user, logOut } from "@/plugins/firebase";
import type Recipe from "@/components/Models/Recipe.class";
import { useRouter } from "vue-router";
import AddRecipeDialog from "@/components/AddRecipeDialog.vue";
import AddJsonRecipe from "@/components/AddJsonRecipe.vue";
import { useUserStore } from "@/stores/useUserStore";
import RecipeDataTable from "@/components/RecipeDataTable.vue";
const router = useRouter();
const alert = ref(false);
const alertMessage = ref<string | null>(null);
const passField = ref();
const userRecipes = ref<Recipe[]>([]);
const searchQuery = ref("");
const editRoute = ref("/recipe/edit/");
const userState = useUserStore();

const required = computed(() => {
  return (v: string) => !!v || "Darf nicht leer sein.";
});

const filteredRecipes = computed<Recipe[]>(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return userRecipes.value;
  return userRecipes.value.filter((r) => {
    try {
      const name = (r as any).recipeName?.toString().toLowerCase() ?? "";
      const author = (r as any).createdBy?.name?.toString().toLowerCase() ?? "";
      const tags = Array.isArray((r as any).tags)
        ? ((r as any).tags as string[]).join(" ").toLowerCase()
        : "";
      return name.includes(q) || author.includes(q) || tags.includes(q);
    } catch (_) {
      return false;
    }
  });
});

function fetchRecipes(): void {
  userRecipes.value = [];
  getUserRecipe().then((recipes) => (userRecipes.value = recipes));
}
function editRecipe(id: string): void {
  console.log("id: ", id, " route: ", editRoute.value);
  router.push(editRoute.value + id);
}

onBeforeMount(() => {
  getUserRecipe().then((recipes) => (userRecipes.value = recipes));
});
</script>

<style scoped></style>
