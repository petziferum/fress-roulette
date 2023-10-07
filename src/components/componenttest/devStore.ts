import { defineStore } from "pinia";
import Recipe from "@/components/Models/Recipe.class";
import Description from "@/components/Models/Recipe.class";

export interface stateInterface {
  recipe: Recipe;
  recipeList: Recipe[];
}
export const useDevStore = defineStore("devStore", {
  state: () =>
    ({
      recipeList: [],
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
          .withImageSrc("/src/assets/whisky.jpg"),
        Recipe.createEmptyRecipe()
          .withId("123")
          .withRecipeName("Rezept 1")
          .withIngredients([
            { menge: "3", name: "Karotten" },
            { menge: "500g", name: "Hackfleisch" },
          ])
          .withImageSrc(""),
        Recipe.createEmptyRecipe()
          .withId("234523")
          .withRecipeName("Rezept 2")
          .withIngredients([
            { menge: "3", name: "Oliven" },
            { menge: "4 Flaschen", name: "Vodka" },
          ])
          .withImageSrc(""),
        Recipe.createEmptyRecipe()
          .withId("55553")
          .withRecipeName("Rezept 3")
          .withIngredients([
            { menge: "43", name: "Steine" },
            { menge: "500g", name: "Rohes Fleisch" },
          ])
          .withImageSrc(""),
      ];
      this.recipeList = recipes;
    },
  },
  getters: {
    getDevData(state): any {
      return state.recipe;
    },
    getRecipeList(state): Recipe[] {
      return state.recipeList;
    },
  },
});
