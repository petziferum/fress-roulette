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
            <v-btn @click="selectedLetter = ''">All</v-btn>
            <v-btn
              variant="tonal"
              size="x-small"
              class="mr-1"
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
                  <v-card
                    elevation="8"
                    link
                    :to="'/recipe/view/' + r.id">
                    <v-img
                      cover
                      height="250"
                      :src="r.imageSrc" />
                    <v-card-item>
                      <v-card-title>{{ r.recipeName }}</v-card-title>
                    </v-card-item>
                    <v-card-text>
                      <v-row align="center" class="mx-0">
                        <v-rating
                          v-model="r.rating"
                          dense
                          half-increments
                          readonly
                          color="amber"
                          background-color="grey lighten-2"
                          class="mr-2"></v-rating>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12">
                  <v-card elevation="12">
                    <v-card-title>Keine Rezepte mit Anfangsbuchstaben "{{selectedLetter}}" vorhanden</v-card-title>
                    <v-card-text>
                      <v-icon color="brown" size="30">mdi-emoticon-sad</v-icon>
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
const selectedLetter = ref("A");

const filteredRecipes = computed(() => {
  return recipesList.value.filter((r) => {
    if (selectedLetter.value) {
      r.recipeName?.startsWith(selectedLetter.value)
    } else {
      return r;
    }
    }
  );
});

function removeRecipes(): void {
  recipesList.value = [];
  loading.value = false;
}

function fetchRecipes(): void {
  console.clear();
  recipesList.value = [];
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
