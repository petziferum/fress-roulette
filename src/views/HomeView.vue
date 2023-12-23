<template>
  <v-card class="bg-transparent">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card>
          <v-card-title>HomeView</v-card-title>
          <v-card-subtitle>
            <v-text-field
              label="Sche"
              variant="outlined"
              v-model="store.searchQuery"
              append-inner-icon="mdi-close"
              @click:append-inner="store.searchQuery = ''"
            ></v-text-field>
            <v-btn
              variant="tonal"
              elevation="8"
              rounded="0"
              size="x-small"
              style="margin-right: 30px"
              @click.prevent="fetchRecipes"
              >fetch</v-btn
            >
            <v-btn @click="store.searchQuery = ''">All</v-btn>
            <v-btn
              variant="tonal"
              size="x-small"
              class="mr-1"
              v-for="letter in letters"
              @click.prevent="store.searchQuery = letter"
              :key="letter"
              >{{ letter }}</v-btn
            >
          </v-card-subtitle>
          <div>
            <div style="height: 30px" class="text-center">
              <Transition name="fade">
                <v-icon color="blue" size="30" v-if="loading"
                  >mdi-loading mdi-spin</v-icon
                >
              </Transition>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <template v-if="store.getSortedRecipeList().length > 0">
        <v-col
          cols="12"
          lg="6"
          v-for="r in store.getSortedRecipeList()"
          :key="r.id"
        >
          <RecipePreviewCard @viewRecipe="routeToRecipe(r)" :recipe="r" />
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-card elevation="14" rounded="xl">
            <v-card-title
              >Keine Rezepte mit Anfangsbuchstaben "{{ selectedLetter }}"
              vorhanden</v-card-title
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
import Recipe from "@/components/Models/Recipe.class";
import { computed, onMounted, ref } from "vue";
import { useRecipeStore } from "@/stores/useRecipeStore";
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";
import router from "@/router";

const store = useRecipeStore();
const loading = ref(false);
const recipesList = ref<Recipe[]>([]);
const letters = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
const selectedLetter = ref("");

function routeToRecipe(recipe: Recipe): void {
  console.log("routeToRecipe", recipe.id);
  router.push({ name: "viewRecipe", params: { id: recipe.id } });
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

function fetchRecipes(): void {
  recipesList.value = [];
  loading.value = true;

  store.loadAllRecipes();
  console.log("fetchRecipes", store.allRecipes.values());
  setTimeout(() => {
    //store.allRecipes.forEach((r) => recipesList.value.push(r as Recipe));
    recipesList.value = store.getSortedRecipeList();
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

.overlay {
  position: absolute;
  top: 0;
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
</style>
