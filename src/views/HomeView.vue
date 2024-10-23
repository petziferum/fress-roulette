<template>
  <v-card class="bg-transparent mt-12">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card>
          <v-card-title>Rezepte</v-card-title>
          <v-card-subtitle>
            <v-text-field
              label="Search"
              variant="filled"
              v-model="store.searchQuery"
              append-inner-icon="mdi-close"
              @click:append-inner.prevent="clearSearch"
              @focus="onFocus"
              @blur="onBlur"
              :class="{ 'popout': isFocused }"
            ></v-text-field>
          </v-card-subtitle>
          <v-card-actions class="cloudStyle">
            <v-btn
              variant="tonal"
              elevation="8"
              rounded="0"
              size="x-small"
              style="margin-right: 30px"
              @click.prevent="fetchRecipes"
              >fetch</v-btn
            >
            <v-btn @click="resetFilter">All</v-btn>
            <v-chip
              variant="tonal"
              size="small"
              class="mr-1"
              v-for="tag in store.recipeTags"
              filter
              :color="isSelected(tag) ? 'primary' : 'grey'"
              @click.prevent="toggle(tag)"
              :key="tag"
              >{{ tag }}</v-chip
            >
            <div style="height: 30px" class="ma-4 text-center">
              <Transition name="fade">
                <v-icon color="blue" size="30" v-if="loading"
                  >mdi-loading mdi-spin</v-icon
                >
              </Transition>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <template v-if="store.getFilteredRecipeList().length > 0">
        <v-col
          cols="12"
          lg="6"
          v-for="r in store.getFilteredRecipeList()"
          :key="r.id"
        >
          <RecipePreviewCard @viewRecipe="routeToRecipe(r)" :recipe="r" />
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-card elevation="14" rounded="xl">
            <v-card-title
              >Keine Rezepte mit Suchbegriff "{{ store.searchQuery }}" und Tag:
              "{{ store.filterTags }}" vorhanden</v-card-title
            >
            <v-card-text>
              <v-icon color="brown" size="30">mdi-emoticon-sad</v-icon>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import type Recipe from "@/components/Models/Recipe.class";
import { computed, onMounted, ref } from "vue";
import { useRecipeStore } from "@/stores/useRecipeStore";
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";
import router from "@/router";

const store = useRecipeStore();
const loading = ref(false);
const recipesList = ref<Recipe[]>([]);
const tags = computed(() => store.recipeTags);
const selectedLetter = ref("");

const isFocused = ref(false);

const onFocus = () => {
  isFocused.value = true;
};
const onBlur = () => {
  isFocused.value = false;
};
const clearSearch = () => {
  store.searchQuery = "";
};
function routeToRecipe(recipe: Recipe): void {
  console.log("routeToRecipe", recipe.id);
  router.push({ name: "viewRecipe", params: { id: recipe.id } });
}
function isSelected(tag: string): boolean {
  return store.filterTags.indexOf(tag) !== -1;
}
function toggle(tag: string): void {
  if (store.filterTags.indexOf(tag) !== -1) {
    store.filterTags = store.filterTags.filter((t) => t !== tag);
  } else {
    store.filterTags.push(tag);
  }
}
function getButtonStyle(tag) {
  // Example: Change size based on some property of the tag
  const size = 100;
  return {
    fontSize: size + "px",
    // Add other dynamic styles if needed
  };
}
const filteredRecipes = computed(() => {
  if (selectedLetter.value) {
    return recipesList.value.filter((r) =>
      r.recipeName?.toLowerCase().startsWith(selectedLetter.value.toLowerCase())
    );
  } else {
    return recipesList.value;
  }
});
function resetFilter(): void {
  store.searchQuery = "";
  store.filterTags = [];
}
function fetchRecipes(): void {
  recipesList.value = [];
  loading.value = true;

  store.loadAllRecipes();
  store.fetchRecipeTags();
  console.log("fetchRecipes", store.allRecipes.values());
  setTimeout(() => {
    //store.allRecipes.forEach((r) => recipesList.value.push(r as Recipe));
    recipesList.value = store.getFilteredRecipeList();
    loading.value = false;
  }, 500);
}

onMounted(() => {
  fetchRecipes();
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.9s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.image-wrapper {
  position: relative;
}

.popout {
  position: fixed;
  top: 50px;
  left: 5%;
  transform: translateY(100%);
  width: 90%;
  z-index: 1000; /* Adjust if necessary */
  transition: all 0.5s ease-in-out;
  background-color: white; /* Ensure the background covers content behind */
  padding: 10px; /* Optional: adjust padding to your needs */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: add shadow for better visibility */
}
.v-text-field--popout {
  position: fixed;
  top: 50px;
  left: 25%;
  transform: translateX(-50%);
  width: 50%;
  z-index: 1000;
  background-color: white;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.overlay {
  position: absolute;
  top: 3em;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay:hover {
  opacity: 1;
  cursor: pointer;
}
.cloudStyle {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Adjust as needed */
}

/* Example dynamic styling function in your Vue component */
</style>
