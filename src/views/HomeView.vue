<template>
  <v-container>
    <v-row>
      <v-col>
        geladen? {{ state.recipesLoaded }}
        <v-btn @click="fetchRecipes">Lade Rezepte</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="state.recipesLoaded">
      <!-- https://vuejs.org/guide/components/props.html#prop-passing-details -->
      <v-col cols="6" v-for="recipe of state.recipesList" :key="recipe.id">
        <receipe-card v-bind="recipe" v-model="state.searchText" />
      </v-col>
    </v-row>
    <div v-else>nichts geladen...</div>
    v-model = {{ state.beispiel }}, suchtext: {{ state.searchText }}
    <receipe-card v-bind="state.dummyRecipe"></receipe-card>
    <div class="ma-3">suchfeld: <custom-input v-model="state.searchText" /></div>
  </v-container>
</template>

<script lang="ts" setup>
import ReceipeCard from "@/components/ReceipeCard.vue";
import { getCollection } from "@/plugins/firebase";
import {onMounted, reactive} from "vue";
import CustomInput from "@/components/CustomInput.vue";

//Interface für den State
interface State {
  recipesLoaded: boolean;
  recipesList: any[];
  dummyRecipe: Recipe
}

interface Recipe {
  recipeName: string,
  createdBy: string
}
//Der State mit Typdeclaration aus dem Interface
const state: State = reactive({
  recipesLoaded: false,
  recipesList: [],
  beispiel: "Beispielwurst",
  searchText: "suche",
  dummyRecipe: { recipeName: "Dummy Rezept", createdBy: "Petziferum"}
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

onMounted(() => {
  console.log("mounted")
})
</script>
