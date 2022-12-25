<template>
  <div class="mx-2">
    <v-row>
      <v-col> Dev Test View </v-col>
    </v-row>
    <v-row>
      <v-col>
        <recipes-view :recipes="recipeArray" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tags-select v-model="recipe" />
        rezept in dev: {{ recipe }}
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import { ref } from "vue";
import RecipesView from "@/components/componenttest/RecipesView.vue";
import Recipe from "@/components/Models/Recipe.class";


const recipe = ref({
  recipeName: "rezept 1",
  createdBy: "Petzi",
  tags: ["deftig"],
});
const recipeArray = ref<Recipe[]>([recipe.value]);
</script>

<style scoped></style>
