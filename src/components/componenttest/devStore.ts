import { defineStore } from "pinia";
import Recipe from "@/components/Models/Recipe.class";
import { Difficulty } from "@/components/Models/Difficulty";
import testrecipes from "@/components/componenttest/testrecipes.json";


export interface stateInterface {
  recipe: Recipe;
  recipeList: Recipe[];
  searchQuery: string;
  loading: boolean;
}
export const useDevStore = defineStore("devStore", {
  state: () =>
    ({
      recipeList: [],
      searchQuery: "",
      loading: false,
      recipe: Recipe.createEmptyRecipe()
        .withRecipeName("Test Recipe")
        .withIngredients([
          { menge: "7", name: "Zwiebeln" },
          { menge: "54", name: "Knoblauch" },
        ])
        .withRecipeDescription([{ nr: 1, text: "Zwiebeln schneiden", img: "" }])
        .withImageSrc("/src/assets/whisky.jpg"),
    } as stateInterface),
  actions: {
    initRecipes() {
      this.recipeList = Object.assign([], testrecipes);
    },
  },
  getters: {
    getSortedRecipeList(state): Recipe[] {
      state.loading = true;
      const filteredList = state.recipeList.filter((recipe) =>
        recipe.recipeName
          ?.toLowerCase()
          .includes(state.searchQuery.toLowerCase())
      );

      const sortedList = filteredList.sort((a, b) => {
        const nameA = a.recipeName?.toLowerCase();
        const nameB = b.recipeName?.toLowerCase();
        const searchQueryLower = state.searchQuery.toLowerCase();

        // Check if either name starts with the search query
        const aStartsWithQuery = nameA.startsWith(searchQueryLower);
        const bStartsWithQuery = nameB.startsWith(searchQueryLower);

        // Sort by whether they start with the query and then alphabetically
        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (!aStartsWithQuery && bStartsWithQuery) return 1;
        return nameA.localeCompare(nameB);
      });
      state.loading = false;
      return sortedList;
    },
    getDevData(state): any {
      return state.recipe;
    },
    getRecipeList(state): Recipe[] {
      return state.recipeList;
    },
  },
});
