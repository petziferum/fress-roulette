<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">TheRouletteView</v-col>
    <v-col cols="12" md="6">
      <v-card flat>
        <v-card-title>Title</v-card-title>
        <v-card-text>
          <v-btn @click="fetchRecipes">fetch recipes</v-btn>
        </v-card-text>
        <v-card-text>
          {{ loading }}
          <div v-if="!loading">
            <recipe-roulette :recipes-array="recipesList" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import Recipe from "@/components/Models/Recipe.class";
import { useRecipeStore } from "@/stores/useRecipeStore";
import { load } from "webfontloader";
import RecipeRoulette from "@/components/componenttest/RecipeRoulette.vue";
const store = useRecipeStore();
const loading = ref(false);
const recipesList = computed(() => store.getSortedRecipeList());

function fetchRecipes(): void {
  store.loadAllRecipes().then(() => console.log("promise fertig"));
}
</script>
<style scoped></style>
