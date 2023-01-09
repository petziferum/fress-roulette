<template>
  <v-container>
    <v-card>
      <v-card-title>Neues Rezept</v-card-title>
      <v-card-subtitle>{{ recipe.id }}</v-card-subtitle>

      <v-card-text> {{ recipe }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";

const recipe = ref<Recipe>(Recipe.createEmtptyRecipe());
const router = useRoute();

function loadRecipe() {
  RecipeServiceApi.getSingleRecipe(useRoute().params.id as string).then(
    (response) => {
      if(response) {
        console.log("response recipe id:", response.id, "params id",router.params.id, "same?")
        recipe.value = response!;
      }
    }
  );
}

onBeforeMount(() => {
  loadRecipe();
  recipe.value.id = router.params.id as string;
});
</script>

<style scoped></style>
