import { defineStore } from "pinia";
import { getCollection } from "@/plugins/firebase";
import type Recipe from "@/components/Models/Recipe.class";
import {recipeConverter} from "@/components/Models/Recipe.class";

export interface stateInterface {
  allRecipes: Recipe[];
}

export const recipeStore = defineStore("recipeStore", {
  state: () =>
    ({
      allRecipes: [],
    } as stateInterface),
  actions: {
    loadAllRecipes: function () {
      console.info("store load All Recipes");
      this.allRecipes = [];
      getCollection("test").then((res) => {
        res.forEach((recipeData) => {
          const data = recipeData;
          //const r = recipeConverter.fromFirestore(data, null);
          console.log("converter", data);
          //this.allRecipes.push(recipeData.data);
        });
      });
    },
  },
  getters: {
    getAllRecipes(state): Recipe[] {
      console.log("getter", state.allRecipes);
      return state.allRecipes;
    },
  },
});
