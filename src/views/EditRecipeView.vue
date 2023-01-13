<template>
  <v-container>
    <v-card>
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
      <v-card-subtitle
        >{{ recipe.id }} CreatedBy: {{ recipe.createdBy }}
        <div>Erstellt am: {{ recipe.time }}</div></v-card-subtitle
      >
      <v-card-actions>
        <v-spacer />
        <v-btn variant="outlined" color="success" @click="editMode = !editMode"
          >Bearbeiten</v-btn
        >
        <v-btn variant="outlined" color="blue" @click="saveUpdateRecipe"
          >Speichern</v-btn
        >
      </v-card-actions>
      <template v-if="!editMode">
        <v-card-text>
          Zutaten
          <component-zutat v-model="recipe" />
        </v-card-text>

        <!--- Zubereitungsschritte -->
        <v-card-text>
          <v-card-title>Zubereitungsschritte</v-card-title>
          <component-recipe-description v-model="recipe" />
        </v-card-text>
      </template>

      <!-- Im Editmode  -->
      <template v-else>
        <v-form ref="recipeForm">
          <v-row>
            <v-col>
              <v-text-field label="Rezept Name" v-model="recipe.recipeName" />
            </v-col>
          </v-row>
        </v-form>
      </template>
      {{ recipe }}
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { VForm } from "vuetify/lib/components/index";
import ComponentZutat from "@/components/EditRecipe/ComponentZutat.vue";
import ComponentRecipeDescription from "@/components/EditRecipe/ComponentRecipeDescription.vue";

const editMode = ref(false);
const recipe = ref<Recipe>(Recipe.createEmtptyRecipe());
const router = useRoute();

function loadRecipe(): void {
  RecipeServiceApi.getSingleRecipe(useRoute().params.id as string).then(
    (response) => {
      if (response) {
        const editRecipe = Recipe.createEmtptyRecipe();
        console.log(
          "edit: ",
          editRecipe,
          "response recipe id:",
          response.id,
          "params id",
          router.params.id,
          "same?",
          response.id === router.params.id
        );
        recipe.value = response!;
      }
    }
  );
}

function saveUpdateRecipe(): void {
  recipe.value.active = false;
  console.info("save", recipe.value);
  RecipeServiceApi.updateRecipe(recipe.value).then((antwort) => {
    console.log("gespeichert", antwort);
  });
}

onBeforeMount(() => {
  loadRecipe();
  recipe.value.id = router.params.id as string;
});
</script>

<style scoped></style>
