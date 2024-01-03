<template>
  <v-dialog v-model="isOpen">
    <template v-slot:activator="{ props }">
      <div class="rainbowbutton" v-bind="props"></div>
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
            <v-btn variant="text" color="red" @click="cancel">abbrechen</v-btn>
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
import { useRouter } from "vue-router";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { useRecipeStore } from "@/stores/useRecipeStore";

const props = defineProps(["user"]);
const router = useRouter();
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
.rainbowbutton {
  height: 50px;
  width: 100px;
  position: relative;
  margin-left: 50px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 10%;
  border-radius: 5px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  &:before {
    content: "";
    height: 230%;
    width: 200%;
    position: absolute;
    background: conic-gradient(
      #fd004c,
      #fe9000,
      #fff020,
      #3edf4b,
      #3363ff,
      #b102b7,
      #fd004c
    );
    left: -50%;
    top: -60%;
    animation: spin 3s infinite linear;
  }
  &:after {
    content: "Neu";
    position: absolute;
    cursor: pointer;
    background-color: #1c1b29;
    height: 93%;
    width: 92%;
    top: 3.5%;
    left: 3.5%;
    border-radius: 5px;
    color: #ffffff;
    font-size: 30px;
    letter-spacing: 6px;
    display: grid;
    place-items: center;
  }
}
@keyframes spin {
  100% {
    transform: rotate(-360deg);
  }
}
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
