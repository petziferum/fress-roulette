import { defineStore } from "pinia";
import Recipe from "@/components/Models/Recipe.class";
import { Difficulty } from "@/components/Models/Difficulty";

export interface stateInterface {
  recipe: Recipe;
  recipeList: Recipe[];
  searchQuery: string;
}
export const useDevStore = defineStore("devStore", {
  state: () =>
    ({
      recipeList: [],
      searchQuery: "",
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
          .withRecipeName("Taco al Naturerde")
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
      ];
      this.recipeList = recipes;
    },
  },
  getters: {
    getSortedRecipeList(state): Recipe[] {
      if (state.searchQuery.length > 0) {
        return state.recipeList.filter(recipe => recipe.recipeName?.toLowerCase().includes(state.searchQuery.toLowerCase()))
          .sort((a, b) => {
            const nameA = a.recipeName?.toLowerCase();
            const nameB = b.recipeName?.toLowerCase();
            if (nameA.startsWith(state.searchQuery.toLowerCase()) && !nameB.startsWith(state.searchQuery.toLowerCase())) {
              return nameA.localeCompare(nameB);
            }
            if (nameA.startsWith(state.searchQuery.toLowerCase())) {
              return -1;
            }
            if (nameB.startsWith(state.searchQuery.toLowerCase())) {
              return 1;
            }
            return nameA.localeCompare(nameB);
          });
      } else {
        return state.recipeList.sort((a, b) => {
          const nameA = a.recipeName.toLowerCase();
          const nameB = b.recipeName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }
    },
    getDevData(state): any {
      return state.recipe;
    },
    getRecipeList(state): Recipe[] {
      return state.recipeList;
    },
  },
});
