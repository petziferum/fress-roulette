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
      /*
      const recipes = [
        Recipe.createEmptyRecipe()
          .withRecipeName("Test Recipe")
          .withIngredients([
            { menge: "7", name: "Zwiebeln" },
            { menge: "54", name: "Knoblauch" },
          ])
          .withRecipeDescription([
            { nr: 1, text: "Zwiebeln schneiden", img: "" },
          ])
          .withDifficulty(Difficulty.EASY)
          .withImageSrc("/src/assets/whisky.jpg"),
        Recipe.createEmptyRecipe()
          .withId("123")
          .withRecipeName("Benzin Käsefondue")
          .withIngredients([
            { menge: "3", name: "Karotten" },
            { menge: "500g", name: "Hackfleisch" },
          ])
          .withImageSrc(""),
        Recipe.createEmptyRecipe()
          .withId("234523")
          .withRecipeName("Taco con Naturerde")
          .withIngredients([
            { menge: "3", name: "Oliven" },
            { menge: "4 Flaschen", name: "Vodka" },
          ])
          .withDifficulty(Difficulty.IMPOSSIBLE)
          .withImageSrc("")
          .withRating(2.3),
        Recipe.createEmptyRecipe()
          .withId("55553")
          .withRecipeName("Stein Suppe")
          .withIngredients([
            { menge: "43", name: "Steine" },
            { menge: "500g", name: "Rohes Fleisch" },
          ])
          .withImageSrc(""),
        Recipe.createEmptyRecipe()
          .withId("123asdf")
          .withRecipeName("Alkohol Nitroglyzerin Cocktail")
          .withDifficulty(Difficulty.EASY)
          .withRating(5),
        Recipe.createEmptyRecipe()
          .withId("123asd345f")
          .withRecipeName("Zyankali Salad")
          .withIngredients([
            { menge: "1", name: "Zyankali" },
            { menge: "1", name: "Salad" },
          ])
          .withDifficulty(Difficulty.MEDIUM)
          .withRating(3),
        Recipe.createEmptyRecipe()
          .withRecipeName("Cyanid Suppe")
          .withRating(4.5)
          .withIngredients([
            { menge: "100g", name: "Cyanid" },
            { menge: "100ml", name: "Suppe" },
          ])
          .withDifficulty(Difficulty.EASY),
        Recipe.createEmptyRecipe()
          .withRecipeName("Viagra Lasagne")
          .withRating(2.5)
          .withIngredients([
            { menge: "500g", name: "Viagra" },
            { menge: "100g", name: "Lasagne" },
          ])
          .withDifficulty(Difficulty.MEDIUM),
      ];
       */
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
