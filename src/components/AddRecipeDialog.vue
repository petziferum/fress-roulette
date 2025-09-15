<template>
  <v-dialog v-model="isOpen">
    <template v-slot:activator="{ props }">
      <rainbow-button style="z-index: 100" v-bind="props" />
    </template>
    <v-card v-if="!loading">
      <v-card-title>Möchtest du ein neues Rezept erstellen?</v-card-title>
      <template v-if="user != null">
        <v-card-subtitle
          >User: {{ user.uid }}<br />
          Name: {{ user.displayName }}</v-card-subtitle
        >
        <v-form ref="createRecipeForm" @submit.prevent="createRecipe">
          <v-card-text>
            <v-text-field
              label="Name des Gerichts"
              :rules="filledRule"
              v-model="newRecipe.recipeName"
            ></v-text-field>
          </v-card-text>
          {{ newRecipe.recipeName }}
          <v-card-actions>
            <v-spacer />
            <v-tooltip text="Schließen ohne speichern" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" color="red" @click="cancel" v-bind="props"
                  >abbrechen</v-btn
                >
              </template>
            </v-tooltip>
            <v-btn variant="text" color="green" type="submit">weiter</v-btn>
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
import { useRecipeStore } from "@/stores/useRecipeStore";
import RainbowButton from "@/components/commons/rainbowButton.vue";

const props = defineProps(["user"]);
const recipeStore = useRecipeStore();
const isOpen = ref(false);
const newRecipe = ref(Recipe.createEmptyRecipe().withActive(false));
const filledRule = ref([(v) => v != null || "Name muss ausgefüllt sein"]);
const loading = ref(false);

function cancel() {
  isOpen.value = false;
}

function createRecipe() {
  newRecipe.value.time = new Date(Date.now());
  newRecipe.value.createdBy = {
    id: props.user.uid,
    name: props.user.displayName,
  };
  const recipe: Recipe = Object.assign({}, newRecipe.value);
  recipeStore.createNewRecipe(recipe).catch((error) => {
    throw new Error("🤡 Fehler aufgetaucht: " + error);
  });
}
</script>

<style scoped>
.dialog {
  z-index: 2;
  top: 9px;
  margin-right: 15px;
  float: right;
  background-image: linear-gradient(
    to left,
    violet,
    indigo,
    blue,
    green,
    yellow,
    orange,
    red
  );
}
</style>
