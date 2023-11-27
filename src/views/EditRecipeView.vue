<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn variant="text" @click="$router.go(-1)">Zurück</v-btn>
          <v-spacer />
          <v-btn variant="outlined" color="blue" @click="saveUpdateRecipe"
            >Speichern</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>
      <v-img :src="recipe.imageSrc ? recipe.imageSrc : dummyImg" class="recipeImage" cover width="350" height="150" />
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
      <v-card-subtitle
        >ID: {{ recipe.id }}<br />
        CreatedBy: {{ recipe.createdBy }}<br />
        <div>Erstellt am: {{ recipe.time }}</div></v-card-subtitle
      >
      <v-card-actions>
        <v-btn
          v-for="(entry, index) in components"
          :key="index"
          @click="setPhotoComponent(entry.component)"
          >{{ entry.text }}</v-btn
        >
      </v-card-actions>
      <component :is="currentComponent" />
      ImageSrc: {{ recipe.imageSrc }}
      <template v-if="!editMode">
        <v-form ref="recipeForm">
          <v-row>
            <v-col>
              <v-text-field label="Rezept Name" v-model="recipe.recipeName" />
            </v-col>
          </v-row>
        </v-form>
        <v-card-text>
          <tags-select v-model="recipe" />
        </v-card-text>
        <v-card-actions> Rating: {{ recipe.rating }} </v-card-actions>
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
      {{ recipe }}
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { VForm } from "vuetify/components";
import ComponentZutat from "@/components/EditRecipe/ComponentZutat.vue";
import ComponentRecipeDescription from "@/components/EditRecipe/ComponentRecipeDescription.vue";
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import ThePhotoUploadComponent from "@/components/componenttest/ThePhotoUploadComponent.vue";
import photoSelectComponent from "@/components/photoSelectComponent.vue";
import { useRecipeStore } from "@/stores/useRecipeStore";

const recipeStore = useRecipeStore();
const editMode = ref(false);
const recipe = computed(()=> {
  return recipeStore.editRecipe;
});
const router = useRoute();
const currentComponent = ref(null);
const dummyImg = "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/recipes%2FQHZ3uF8zribNfFHaPgHH.png?alt=media&token=1f12b930-8400-4508-91ba-9194b0f883e1";
const components = [
  { text: "Select Photo", component: photoSelectComponent },
  { text: "Upload new Photo", component: ThePhotoUploadComponent },
];

function setPhotoComponent(component: any): void {
  currentComponent.value = component;
}

function loadRecipe(): void {
  RecipeServiceApi.getSingleRecipe(useRoute().params.id as string).then(
    (response) => {
      console.log("response", response);
      if (response) {
        const editRecipe = Recipe.createEmptyRecipe();
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

function setPetziAsCreator(): void {
  recipe.value.createdBy = {
    id: "qzkYAA74nXevBDXOGzHHXm0NJmq2",
    name: "Petzi",
  };
  saveUpdateRecipe();
}

onBeforeMount(() => {
  recipeStore.loadEditRecipe(router.params.id as string);
  recipe.value.id = router.params.id as string;
});
</script>

<style scoped>
.recipeImage {
  position: relative;
  float: right;
  top: 0;
  right: 0;
  border: 3px solid black;
}
</style>
