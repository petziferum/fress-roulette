<template>
  <v-container>
    <v-row>
      <v-col>
        geladen? {{ state.recipesLoaded }}
        <v-btn @click="fetchRecipes">Lade Rezepte</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="state.recipesLoaded">
      <v-col cols="6" v-for="recipe of state.recipesList" :key="recipe.id">
        <receipe-card :recipe="recipe" :title="recipe.recipeName" />
      </v-col>
    </v-row>
    <div v-else>nichts geladen...</div>
    <receipe-card v-model="beispiel" title="beispiel"></receipe-card>
  </v-container>
</template>

<script lang="ts" setup>
import ReceipeCard from "@/components/ReceipeCard.vue";
import { getCollection } from "@/plugins/firebase";
import { reactive } from "vue";

//Interface für den State
interface State {
  recipesLoaded: boolean;
  recipesList: any[];
}

//Der State mit Typdeclaration aus dem Interface
const state: State = reactive({
  recipesLoaded: false,
  recipesList: [],
  beispiel: "Beispielrezept",
});

function fetchRecipes(): void {
  console.info("fetch");
  state.recipesList = [];
  getCollection().then((res) => {
    state.recipesLoaded = true;
    res.forEach((doc) => {
      console.info("r", doc.data());
      state.recipesList.push(doc.data());
    });
  });
}
</script>
