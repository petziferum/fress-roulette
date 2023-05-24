import { defineStore } from "pinia";
import Recipe from "@/components/Models/Recipe.class";
import Description from "@/components/Models/Recipe.class";

export interface stateInterface {
  recipe: Recipe;
}
export const useDevStore = defineStore("devStore", {
  state: () =>
    ({
      recipe: Recipe.createEmtptyRecipe()
        .withRecipeName("Test Recipe")
        .withIngredients([{menge: "7", name: "Zwiebeln"}, {menge: "54", name: "Knoblauch"}])
        .withRecipeDescription([{ nr: 1, text: "Zwiebeln schneiden", img: "" }])
        .withImageSrc("/src/assets/whisky.jpg"),
    } as stateInterface),
  actions: {
    // This is where you would put your actions
  },
  getters: {
    getDevData(state): any {
      return state.recipe;
    },
  },
});
