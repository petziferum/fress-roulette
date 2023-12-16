<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn variant="text" @click="$router.go(-1)">Zurück</v-btn>
          <v-btn variant="outlined" color="blue" @click="saveUpdateRecipe"
            >Speichern</v-btn
          >
          <delete-button-dialog
            :recipe="recipe"
            @delete-recipe="deleteRecipe"
          />
          <v-btn @click="showtoast">toast</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-img
        :src="recipe.imageSrc ? recipe.imageSrc : dummyImg"
        class="recipeImage"
        cover
      />
      <v-card-title>{{ recipe.recipeName }}</v-card-title>
      <v-card-subtitle
        >ID: {{ recipe.id }}<br />
        CreatedBy: {{ recipe.createdBy }}<br />
        <div>Erstellt am: {{ recipe.time }}</div></v-card-subtitle
      >
      <v-card-text class="my-5 bg-blue-accent-1">
        <v-btn
          v-for="(entry, index) in components"
          variant="outlined"
          elevation="2"
          :key="index"
          @click="setPhotoComponent(entry.component)"
          >{{ entry.text }}</v-btn
        >
      </v-card-text>
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
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import RecipeServiceApi from "@/api/recipeServiceApi";
import { VForm } from "vuetify/components";
import ComponentZutat from "@/components/EditRecipe/ComponentZutat.vue";
import ComponentRecipeDescription from "@/components/EditRecipe/ComponentRecipeDescription.vue";
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import ThePhotoUploadComponent from "@/components/componenttest/ThePhotoUploadComponent.vue";
import photoSelectComponent from "@/components/photoSelectComponent.vue";
import { useRecipeStore } from "@/stores/useRecipeStore";
import DeleteButtonDialog from "@/components/DeleteButtonDialog.vue";
import { toast } from "vue3-toastify";

const recipeStore = useRecipeStore();
const editMode = ref(false);
const recipe = computed(() => {
  return recipeStore.editRecipe;
});
const router = useRouter();
const route = useRoute();
const currentComponent = ref(null);
const dummyImg =
  "https://firebasestorage.googleapis.com/v0/b/recipes-petzi.appspot.com/o/recipes%2FQHZ3uF8zribNfFHaPgHH.png?alt=media&token=1f12b930-8400-4508-91ba-9194b0f883e1";
const components = [
  { text: "Select Photo", component: photoSelectComponent },
  { text: "Upload new Photo", component: ThePhotoUploadComponent },
];
// Todo: Edit Recipe Seite mit Schwierigkeit und Tags überarbeiten


function setPhotoComponent(component: any): void {
  currentComponent.value = component;H
}

function saveUpdateRecipe(): void {
  recipe.value.active = false;
  console.info("save", recipe.value);
  RecipeServiceApi.updateRecipe(recipe.value).then((antwort) => {
    console.log("gespeichert", antwort);
    router.push({ name: "userdashboard" });
  });
}

function deleteRecipe(id: string): void {
  RecipeServiceApi.deleteRecipe(id).then(() => {
    router.push({ name: "userdashboard" });
  });
}

function setPetziAsCreator(): void {
  recipe.value.createdBy = {
    id: "qzkYAA74nXevBDXOGzHHXm0NJmq2",
    name: "Petzi",
  };
  saveUpdateRecipe();
}

function showtoast(): void {
  const url = "https://www.youtube.com/watch?v=QH2-TGUlwu4";
  toast.info("File uploaded! \n"+`${url}`, { dangerouslyHTMLString: true });
}
onMounted(() => {
  recipeStore.loadEditRecipe(route.params.id as string);
  recipe.value.id = route.params.id as string;
});
</script>

<style scoped>
.recipeImage {
  z-index:2;
  position: relative;
  float: right;
  width:450px;
  height:180px;
  top: 0;
  right: 0;
  border: 3px solid black;
  border-radius: 15px;
}
</style>
