<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10">
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
          </v-card-subtitle>
          <v-row>
            <v-col cols="12">
              <recipe-roulette :recipes-array="recipesList" />
            </v-col>
          </v-row>
          <recipe-preview-card
            v-for="recipe in recipesList"
            :recipe="recipe"
            :key="recipe.id"
          />
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
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";

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
.image-wrapper {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay:hover {
  opacity: 1;
  cursor: pointer;
}
</style>
