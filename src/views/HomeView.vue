<template>
  <v-container>
    <v-row>
      <v-col>
        geladen? {{ state.recipesLoaded }}
        <v-btn @click="fetchRecipes" v-if="!state.recipesLoaded"
          >Lade Rezepte</v-btn
        >
        <v-btn v-else @click="removeRecipes">Rezepte entfernen</v-btn>
      </v-col>
    </v-row>
    <v-row justify="left" v-if="state.recipesLoaded">
      <!-- https://vuejs.org/guide/components/props.html#prop-passing-details -->
      <v-col cols="4" v-for="recipe of state.recipesList" :key="recipe.id">
        <receipe-card :recipe="recipe" v-model="state.searchText" />
      </v-col>
    </v-row>
    <div v-else>nichts geladen...</div>
    v-model = {{ state.beispiel }}, suchtext: {{ state.searchText }}
    <receipe-card :recipe="state.dummyRecipe"></receipe-card>
    <div class="ma-3">
      suchfeld: <custom-input v-model="state.searchText" />
    </div>
  </v-container>
  {{ state.recipesList.values() }}
</template>

<script lang="ts" setup>
import ReceipeCard from "@/components/ReceipeDetailsCard.vue";
import Recipe from "@/components/Models/Recipe.class";
import { onMounted, reactive } from "vue";
import CustomInput from "@/components/CustomInput.vue";
import { recipeStore } from "@/stores/recipeStore";

//Interface für den State
interface State {
  recipesLoaded: boolean;
  recipesList: any[];
  dummyRecipe: Recipe;
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
  dummyRecipe: Recipe.createEmtptyRecipe()
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
    ]),
});

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
    store.allRecipes.forEach(r => state.recipesList.push(r));
    console.log("geladen", state.recipesList);
    state.recipesLoaded = true;
  }, 1000);
}

onMounted(() => {
  console.log("mounted");
});
</script>
