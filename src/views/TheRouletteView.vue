<template>
  <v-row justify="center">
    <v-col cols="12" class="text-center">TheRouletteView</v-col>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>Title</v-card-title>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Recipe from "@/components/Models/Recipe.class";

const recipesList = ref<Recipe[]>([]);
</script>
<style scoped></style>
