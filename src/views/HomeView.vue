<template>
  <div>
    <v-row justify="center">
      <v-col cols="10">
        <v-card>
          <v-card-title>HomeView</v-card-title>
          <v-card-subtitle>
            <v-btn
              variant="tonal"
              elevation="8"
              rounded="0"
              size="x-small"
              style="margin-right: 30px"
              @click.prevent="fetchRecipes"
              >fetch</v-btn
            >
            <v-btn
              variant="tonal"
              size="x-small"
              v-for="letter in letters"
              @click.prevent="selectedLetter = letter"
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

            <v-row no-gutters>
              <v-col cols="3">
                Rezepte mit Buchstaben: "{{ selectedLetter }}"
              </v-col>
              <v-col cols="9">{{ recipesList.length }} Rezepte geladen </v-col>
              <template v-if="filteredRecipes.length > 0">
                <v-col cols="4" v-for="r in filteredRecipes" :key="r.id">
                  <v-card elevation="12" link :to="'/recipe/view/' + r.id">
                    true

                    <div class="image-wrapper">
                      <v-img :src="r.imageSrc" height="100px" cover>
                        <div class="overlay">
                          <v-card-title>{{ r.recipeName }}</v-card-title>
                        </div>
                      </v-img>
                    </div>
                  </v-card>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12">
                  <v-card elevation="12">
                    <v-card-title>Keine Rezepte vorhanden</v-card-title>
                    <v-card-text>
                      <v-icon color="red" size="30">mdi-alert</v-icon>
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import Recipe from "@/components/Models/Recipe.class";
import { computed, onMounted, ref } from "vue";
import { recipeStore } from "@/stores/recipeStore";

const store = recipeStore();
const loading = ref(false);
const recipesList = ref<Recipe[]>([]);
const letters = ref("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
const selectedLetter = ref("a");

const filteredRecipes = computed(() => {
  return recipesList.value.filter((r) =>
    r.recipeName?.startsWith(selectedLetter.value)
  );
});

function removeRecipes(): void {
  recipesList.value = [];
  loading.value = false;
}

function fetchRecipes(): void {
  console.clear();
  recipesList.value = [];
  const db = "recipes";
  loading.value = true;

  store.loadAllRecipes();
  console.log("fetchRecipes", store.allRecipes.values());
  setTimeout(() => {
    store.allRecipes.forEach((r) => recipesList.value.push(r as Recipe));
    loading.value = false;
  }, 1000);
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
