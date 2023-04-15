import { defineStore } from "pinia";
import type Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";

export interface recipeStateInterface {
  allRecipes: Recipe[];
  recipesLoading: boolean;
}

export const recipeStore = defineStore("recipeStore", {
  state: () =>
    ({
      allRecipes: [],
      recipesLoading: false,
    } as recipeStateInterface),
  actions: {
    loadAllRecipes: function (): Promise<void> {
      this.recipesLoading = true;
      this.allRecipes = [];
      console.log("lade rezepte");
     return  RecipeServiceApi.getRecipes().then((recipes) => {
        this.allRecipes = recipes;
        this.recipesLoading = false;
        console.log("fetch fertig", this.recipesLoading);
      });
    },
  },
  getters: {
    getAllRecipes(state): Recipe[] {
      return state.allRecipes;
    },
    getLoadingState(state): boolean {
      return state.recipesLoading;
    }
  },
});
