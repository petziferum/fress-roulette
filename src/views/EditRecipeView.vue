<template>
  <v-container>
    <v-card :title="recipe.recipeName">
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
        </v-toolbar-items>
      </v-toolbar>
      <v-img
        :src="recipe.imageSrc ? recipe.imageSrc : dummyImg"
        class="recipeImage"
        cover
      />
      <v-card-subtitle id="informations"
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
      <v-card-text id="rating">
        <div class="text-h4 text-shades-black">Rating: {{ recipe.rating }}</div>
        <div class="container">
          <v-rating class="stars" :model-value="recipe.rating" active-color="yellow" length="10" dense half-increments></v-rating>
        </div>
        <v-slider
          v-model="recipe.rating"
          prepend-icon="mdi-emoticon-sick"
          append-icon="mdi-star"
          max="10"
          step="0.5"
          thumb-label
        ></v-slider>
      </v-card-text>
      <v-card-text id="difficulty">
        <div class="text-h4 text-shades-black">
          Schwierigkeitsgrad: {{ recipe.difficulty }}
        </div>
        <v-slider
          v-model="recipe.difficulty"
          prepend-icon="mdi-emoticon-sick"
          append-icon="mdi-emoticon-happy"
          max="10"
          step="0.5"
          thumb-label
        ></v-slider>
      </v-card-text>
      <v-card-text id="ingredients">
        Zutaten
        <component-zutat v-model="recipe" />
      </v-card-text>

      <!--- Zubereitungsschritte -->
      <v-card-text>
        <v-card-title>Zubereitungsschritte</v-card-title>
        <component-recipe-description v-model="recipe" />
      </v-card-text>
      {{ recipe }}
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
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

function setPhotoComponent(component: any): void {
  currentComponent.value = component;
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

onMounted(() => {
  recipeStore.loadEditRecipe(route.params.id as string);
  recipe.value.id = route.params.id as string;
});
</script>

<style scoped>
@keyframes float {
  0% {
    box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
    transform: translatey(0px);
  }
  50% {
    box-shadow: 0 25px 15px 0px rgba(0,0,0,0.2);
    transform: translatey(-20px);
  }
  100% {
    box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
    transform: translatey(0px);
  }
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stars {
  box-sizing: border-box;
  border: 0px white solid;
  overflow: hidden;
  box-shadow: 0 5px 15px 0px rgba(0,0,0,0.6);
  transform: translatey(0px);
  animation: float 6s ease-in-out infinite;
}
.recipeImage {
  z-index: 2;
  position: relative;
  float: right;
  width: 100%;
  height: 250px;
  top: 0;
  right: 0;
}
</style>
