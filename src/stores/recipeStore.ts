import { defineStore } from "pinia";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { ref } from "vue";
import type Recipe from "@/components/Models/Recipe.class";

export const recipeStore = defineStore("recipeStore", () => {
  const allRecipes = ref<Recipe[]>([]);
  const viewRecipe = ref<Recipe | undefined>(undefined);
  const recipesLoading = ref(false);

  function loadAllRecipes(): Promise<void> {
    recipesLoading.value = true;
    allRecipes.value = [];
    console.log("lade rezepte");
    return RecipeServiceApi.getRecipes().then((recipes) => {
      allRecipes.value = recipes;
      recipesLoading.value = false;
      console.log("fetch fertig", recipesLoading.value);
    });
  }

  function loadRecipeById(id) {
    console.log("foo", id);
    recipesLoading.value = true;
    RecipeServiceApi.getSingleRecipe(id)
      .then((res) => {
        if (res) {
          console.log("response", res);
          viewRecipe.value = res;
        }
      })
      .then(() => (recipesLoading.value = false));
  }

  return { allRecipes, loadAllRecipes, recipesLoading, loadRecipeById, viewRecipe };
});
