<template>
  <div>
    <v-row justify="center">
      <v-col cols="10">
        <v-card height="2000px">
          <v-card-title>Hauptansicht</v-card-title>
          <v-card-subtitle>
            <v-btn
              variant="tonal"
              elevation="8"
              rounded="0"
              size="x-small"
              style="margin-right: 30px"
              @click.prevent="fetchRecipes"
              >fetch</v-btn
            >
            <v-btn
              variant="tonal"
              elevation="8"
              rounded="0"
              size="x-small"
              @click="loading = !loading"
              >loading</v-btn
            >
          </v-card-subtitle>
          <div>
            <div style="height: 30px" class="text-center">
              <Transition name="fade">
                <v-icon color="blue" size="30" v-if="loading"
                  >mdi-loading mdi-spin</v-icon
                >
              </Transition>
            </div>
            <v-row>
              <v-col cols="12">
                <recipe-roulette :recipes-array="recipesList" />
              </v-col>
            </v-row>
            <v-expansion-panels>
              <v-expansion-panel v-for="recipe in recipesList" :key="recipe.id">
                <v-expansion-panel-title>{{
                  recipe.recipeName
                }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <receipe-details-card :recipe="recipe" />
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
import RecipeRoulette from "@/components/componenttest/RecipeRoulette.vue";
import ReceipeDetailsCard from "@/components/ReceipeDetailsCard.vue";

const store = recipeStore();
const loading = ref(false);
const recipesList = ref<Recipe[]>([]);

function removeRecipes(): void {
  recipesList.value = [];
  loading.value = false;
}

function fetchRecipes(): void {
  console.clear();
  recipesList.value = [];
  const db = "recipes";
  loading.value = true;

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
