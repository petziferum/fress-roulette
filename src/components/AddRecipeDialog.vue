<template>
  <v-dialog v-model="isOpen">
    <template v-slot:activator="{ props }">
      <v-btn
        style="z-index: 2; top: 9px; margin-right: 15px; float: right"
        elevation="4"
        color="orange"
        v-bind="props"
        large
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </template>
    <v-card v-if="!loading">
      <v-card-title>Möchtest du ein neues Rezept erstellen?</v-card-title>
      <template v-if="userId != null">
        <v-card-subtitle>User: {{ userId }}</v-card-subtitle>
        <v-form ref="createRecipeForm">
          <v-card-text>
            <v-text-field
              label="Name des Gerichts"
              :rules="filledRule"
              v-model="newRecipe.recipeName"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="red" @click="cancel">abbrechen</v-btn>
            <v-btn text color="green" @click="createRecipe">weiter</v-btn>
          </v-card-actions>
        </v-form>
      </template>
      <template v-else>
        <v-icon>mdi-loading mdi-spin</v-icon>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Recipe from "@/components/Models/Recipe.class";
import { useRouter } from "vue-router";
import RecipeServiceApi from "@/api/recipeServiceApi";

const bgImage = ref("/src/assets/whisky.jpg");
const props = defineProps(["userId"]);
const router = useRouter();
const isOpen = ref(false);
const newRecipe = ref(
  Recipe.createEmtptyRecipe().withActive(false).withCreatedBy(props.userId)
);
const filledRule = ref([(v) => v != null || "Name muss ausgefüllt sein"]);
const loading = ref(false);

function cancel() {
  isOpen.value = false;
}

function createRecipe() {
  let route = "/recipe/new/" + newRecipe.value.id;
  //Setze aktuelle Zeit in Rezept
  newRecipe.value.time = new Date(Date.now());
  RecipeServiceApi.createNewEditRecipe(newRecipe.value)
    .then((id) => {
      newRecipe.value.id = id;
      route = "/recipe/edit/" + id;
    })
    .then(() => {
      router.push(route);
    })
    .catch((error) => {
      console.log("Fehler: ", error);
    });
}
</script>

<style scoped></style>
