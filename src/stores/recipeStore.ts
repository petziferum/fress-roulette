import { defineStore } from "pinia";
import type Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";

export interface recipeStateInterface {
  allRecipes: Recipe[];
  viewRecipe: Recipe | undefined;
  recipesLoading: boolean;
}

export const recipeStore = defineStore("recipeStore", {
  state: () =>
    ({
      allRecipes: [],
      viewRecipe: undefined,
      recipesLoading: false,
    } as recipeStateInterface),
  actions: {
    loadAllRecipes: function (): Promise<void> {
      this.recipesLoading = true;
      this.allRecipes = [];
      console.log("lade rezepte");
      return RecipeServiceApi.getRecipes().then((recipes) => {
        this.allRecipes = recipes;
        this.recipesLoading = false;
        console.log("fetch fertig", this.recipesLoading);
      });
    },
    loadRecipeById: function (id) {
      console.log("foo", id);
      this.recipesLoading = true;
      RecipeServiceApi.getSingleRecipe(id).then((res) => {
        console.log("response", res);
        this.viewRecipe = res ? res : undefined;
        this.recipesLoading = false;
      });
    },
  },
  getters: {
    getAllRecipes(state): Recipe[] {
      return state.allRecipes;
    },
    getLoadingState(state): boolean {
      return state.recipesLoading;
    },
  },
});
