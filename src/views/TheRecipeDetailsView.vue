<template>
  <v-container>
    <v-row justify="center" class="mt-8">
      <template v-if="loading">
        <v-col class="text-center">
          <v-icon size="x-large">mdi-loading mdi-spin</v-icon>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" md="8">
          <v-card
            style="
              position: relative;
              top: -50px;
              margin-left: 5px;
              margin-right: 5px;
            "
            elevation="10"
            rounded="xl"
          >
            <v-img
              :src="recipe.imageSrc"
              cover
              height="300px"
              class="mt-0 pt-0"
            />
            <v-toolbar class="mb-4">
              <v-toolbar-items>
                <v-btn icon @click="goBack">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </v-toolbar-items>
              <div class="text-center">
                <span class="text-h6 mx-4">{{ recipe.recipeName }}</span>
              </div>
              <div class="text-end">
                <v-rating
                  :model-value="recipe.rating"
                  hover
                  :length="5"
                  color="blue"
                  active-color="primary"
                />
              </div>
              <div class="text-h6">{{ recipe.rating }}/</div>
              <span>5</span>
              <div class="text-black ml-5 text-right">
                Level: {{ recipe.difficulty }}
              </div>
            </v-toolbar>
            <v-card-subtitle>
              <div class="subtitle-row">Autor: {{ recipe.createdBy.name }}</div>
              <div class="subtitle-row">
                erstellt am: {{ new Date(recipe.time).toLocaleString() }}
              </div>
            </v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col class="font-weight-light text-blue-accent-1">
                  Beschreibung: {{ recipe.description }}
                </v-col>
              </v-row>
              <v-row>
                <v-col> Typ: {{ recipe.type }} </v-col>
              </v-row>
            </v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-list>
                  <v-list-item v-for="z in recipe.ingredients" :key="z.name">
                    <v-list-item-title>
                      <span v-if="z.menge">{{ z.menge }} - </span>
                      <span v-else> - - </span>{{ z.name }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="8">
                <v-card-text
                  v-for="text in recipe.recipeDescription"
                  :key="text.nr"
                  class="text-body-1 ma-4"
                >
                  <v-row>
                    <v-col cols="1">{{ text.nr }}.</v-col>
                    <v-col cols="10">
                      <template v-if="editItemNumber === text.nr">
                        <v-textarea v-model="editItemText"></v-textarea>
                        <v-spacer />
                        <div style="text-align: right">
                          <v-btn class="mr-2" color="error" @click="cancel"
                            >Abbrechen</v-btn
                          >
                          <v-btn color="success">Speichern</v-btn>
                        </div>
                      </template>
                      <template v-else>{{ text.text }} </template></v-col
                    >
                    <v-col cols="1">
                      <template v-if="edit">
                        <v-btn icon flat
                          ><v-icon size="small">mdi-pencil</v-icon></v-btn
                        >
                      </template>
                    </v-col>
                  </v-row>
                  <v-divider />
                </v-card-text>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-h5 font-weight-thin">
                  Schwierigkeit:
                  {{ recipe.difficulty ? recipe.difficulty : "--" }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-card-text>
                <div
                  v-for="(value, key) in recipe"
                  :key="key"
                  class="pt-2 pl-3"
                >
                  {{ key }}: {{ value }}
                  <v-divider thickness="4" />
                </div>
              </v-card-text>
            </v-row>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { useRecipeStore } from "@/stores/useRecipeStore";
import { computed, nextTick, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";
import router from "@/router";
const id = ref("");
const editItemNumber = ref(null);
const edit = ref(true);
const editItemText = ref("");
const store = useRecipeStore();
const recipe = computed((): Recipe | undefined => store.viewRecipe);
const loading = computed({
  get() {
    return store.recipesLoading;
  },
  set(value) {
    store.recipesLoading = value;
  },
});
onBeforeMount(function () {
  const route = useRoute();
  id.value = route.params.id as string;
  store.loadRecipeById(id.value);
  console.log("route params", id.value);
});

function goBack() {
  router.push("/");
}

function cancel() {
  editItemNumber.value = null;
  editItemText.value = "";
}
</script>
<style scoped>
.subtitle-row {
  font-weight: initial;
}
</style>
