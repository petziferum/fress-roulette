import { defineStore } from "pinia";
import { ref } from "vue";
import { getCollection } from "@/plugins/firebase";
import Recipe from "@/components/Models/Recipe.class";

export const recipeStore = defineStore("recipeStore", {
  state: () => ({
    allRecipes: [],
  }),
  actions: {
    loadAllRecipes() {
      console.info("store load All Recipes");
      this.allRecipes = [];
      getCollection("test").then((res) => {
        res.forEach((recipeData) => {
          console.log(recipeData.data());
          this.allRecipes.push(recipeData.data());
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
