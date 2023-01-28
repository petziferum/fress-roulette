<template>
  <div>
    <v-row justify="center">
      <v-col cols="4">
        <v-card height="2000px">
          <v-card-title>Hauptansicht</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import Recipe from "@/components/Models/Recipe.class";
import { reactive } from "vue";
import { recipeStore } from "@/stores/recipeStore";

//Interface für den State
interface State {
  recipesLoaded: boolean;
  recipesList: any[];
  beispiel: string;
  searchText: string;
}
const store = recipeStore();

//Der State mit Typ-declaration aus dem Interface
const state: State = reactive({
  recipesLoaded: false,
  recipesList: [],
  beispiel: "Beispielwurst",
  searchText: "suche",
});
const dummyRecipe = reactive(
  Recipe.createEmtptyRecipe()
    .withRecipeName("Dummy Rezept")
    .withCreatedBy("Petzi")
    .withTags(["dummy", "lecker"])
    .withIngredients([
      { nr: 1, menge: "1Tl", name: "Zucker" },
      { nr: 2, menge: "100g", name: "Butter" },
    ])
    .withRecipeDescription([
      { nr: 1, text: "kochen und backen", img: "no Image" },
      { nr: 2, text: "Dann Backen und schneiden", img: "no Image" },
    ])
);

function removeRecipes(): void {
  state.recipesList = [];
  state.recipesLoaded = false;
}

function fetchRecipes(): void {
  console.clear();
  state.recipesList = [];
  /*getCollection("test").then((res) => {
    state.recipesLoaded = true;
    res.forEach((doc) => {
      console.info("r", doc.data());
      state.recipesList.push(doc.data());
    });
  });
   */
  store.loadAllRecipes();
  console.log("fetchRecipes", store.allRecipes.values());
  setTimeout(() => {
    store.allRecipes.forEach((r) => state.recipesList.push(r));
    console.log("geladen", state.recipesList);
    state.recipesLoaded = true;
  }, 1000);
}
</script>
