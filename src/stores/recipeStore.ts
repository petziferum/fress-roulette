import { defineStore } from "pinia";
import type Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";

export interface recipeStateInterface {
  allRecipes: Recipe[];
}

export const recipeStore = defineStore("recipeStore", {
  state: () =>
    ({
      allRecipes: [],
    } as recipeStateInterface),
  actions: {
    loadAllRecipes: function () {
      this.allRecipes = [];
      RecipeServiceApi.getRecipes().then((recipes) => {
        this.allRecipes = recipes;
      });
    },
  },
  getters: {
    getAllRecipes(state): Recipe[] {
      return state.allRecipes;
    },
  },
});
