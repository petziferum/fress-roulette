import { defineStore } from "pinia";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { ref } from "vue";
import type Recipe from "@/components/Models/Recipe.class";

// PINIA SETUP STORE

export const useRecipeStore = defineStore("recipeStore", () => {
  const allRecipes = ref<Recipe[]>([]);
  const viewRecipe = ref<Recipe | undefined>(undefined);
  const recipesLoading = ref(false);
  const searchQuery = ref("");
  const recipeImages = ref([]);

  const getAllRecipeImages = () => {
    RecipeServiceApi.getAllRecipeImages()
      .then((res) => {
        recipeImages.value = res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    recipesLoading.value = true;
    RecipeServiceApi.getSingleRecipe(id)
      .then((res) => {
        if (res) {
          viewRecipe.value = res;
        }
      })
      .catch((err) => {
        console.error("Es ist gerade ein Fehler aufgetreten:\n", err);
      })
      .finally(() => (setTimeout(() => recipesLoading.value = false, 100)));
  }

  function saveUpdateRecipe(recipe: Recipe): void {
    console.info("save", recipe);
    RecipeServiceApi.updateRecipe(recipe).then((antwort) => {
      console.log("gespeichert", antwort);
    });
  }

  function updateRecipeImage(image: string) {
    console.log("update image", image);
    viewRecipe.value.imageSrc = image;
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
    recipeImages,
    getAllRecipeImages,
    updateRecipeImage,
  };
});