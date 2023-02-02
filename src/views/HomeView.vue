<template>
  <div>
    <v-row justify="center">
      <v-col cols="4">
        <v-card height="2000px">
          <v-card-title>Hauptansicht</v-card-title>
          <v-card-subtitle>
            <v-btn variant="tonal" elevation="8" rounded="0" size="x-small" style="margin-right: 30px" @click.prevent="fetchRecipes">fetch</v-btn>
            <v-btn variant="tonal" elevation="8" rounded="0" size="x-small" @click="loading = !loading">loading</v-btn>
          </v-card-subtitle>
          <div>
            <div style="height:30px" class="text-center">
              <Transition name="fade">
              <v-icon color="blue" size="30" v-if="loading">mdi-loading mdi-spin</v-icon>
              </Transition>
            </div>
            <v-expansion-panels>
              <v-expansion-panel v-for="recipe in recipesList" :key="recipe.id">
                <v-expansion-panel-title>{{
                  recipe.recipeName
                }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col>
                      {{ recipe.id }}
                    </v-col>
                    <v-col>
                      {{ recipe.createdBy }}
                    </v-col>
                    <v-col cols="12">
                      {{ recipe.ingredients }}
                    </v-col>
                    <v-col>
                      {{ recipe.description }}
                    </v-col>
                    <v-col>
                      {{ recipe.tags }}
                    </v-col>
                  </v-row>
                  <div>{{ recipe }}</div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import Recipe from "@/components/Models/Recipe.class";
import { onMounted, ref } from "vue";
import { recipeStore } from "@/stores/recipeStore";

const store = recipeStore();
const loading = ref(false);
const recipesList = ref<Recipe[]>([]);

//Der State mit Typ-declaration aus dem Interface

function removeRecipes(): void {
  recipesList.value = [];
  loading.value = false;
}

function fetchRecipes(): void {
  console.clear();
  recipesList.value = [];
  const db = "recipes";
  loading.value=true;

  store.loadAllRecipes();
  console.log("fetchRecipes", store.allRecipes.values());
  setTimeout(() => {
    store.allRecipes.forEach((r) => recipesList.value.push(r as Recipe));
    loading.value = false;
  }, 1000);
}

onMounted(() => {
  fetchRecipes();
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {

  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

