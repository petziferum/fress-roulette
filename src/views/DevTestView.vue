<template>
  <div class="mx-2">
    <v-row>
      <v-col> Dev Test View </v-col>
    </v-row>
    <v-row>
      <v-col>
        <recipe-preview-card :recipe="recipe" />
      </v-col>
      <v-col cols="12">
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
import { ref, reactive } from "vue";
import RecipesView from "@/components/componenttest/RecipesView.vue";
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";
import imgUrl from "@/assets/whisky.jpg";

const recipe = reactive({
  recipeName: "rezept 1",
  img: imgUrl,
  createdBy: "Petzi",
  tags: ["deftig"],
});
const recipeArray = ref([recipe]);
</script>

<style scoped></style>
