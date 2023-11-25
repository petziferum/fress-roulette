import { defineStore } from "pinia";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { ref } from "vue";
import type Recipe from "@/components/Models/Recipe.class";

// PINIA SETUP STORE

export const recipeStore = defineStore("recipeStore", () => {
  const allRecipes = ref<Recipe[]>([]);
  const viewRecipe = ref<Recipe | undefined>(undefined);
  const recipesLoading = ref(false);
  const searchQuery = ref("");

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
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => (recipesLoading.value = false));
  }

  function getSortedRecipeList(): Recipe[] {
    recipesLoading.value = true;
    const filteredList = allRecipes.value.filter((recipe) =>
      recipe.recipeName?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    const sortedList = filteredList.sort((a, b) => {
      const nameA = a.recipeName?.toLowerCase();
      const nameB = b.recipeName?.toLowerCase();
      const searchQueryLower = searchQuery.value.toLowerCase();

      // Check if either name starts with the search query
      const aStartsWithQuery = nameA.startsWith(searchQueryLower);
      const bStartsWithQuery = nameB.startsWith(searchQueryLower);

      // Sort by whether they start with the query and then alphabetically
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;
      return nameA.localeCompare(nameB);
    });
    recipesLoading.value = false;
    return sortedList;
  }

  return {
    allRecipes,
    searchQuery,
    getSortedRecipeList,
    loadAllRecipes,
    recipesLoading,
    loadRecipeById,
    viewRecipe,
  };
});
