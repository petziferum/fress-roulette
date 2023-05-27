<template>
  <div class="mx-2">
    <v-row justify="center">
      <v-col cols="4">
        <div class="text-h1">Dev Test View</div></v-col>
    </v-row>
    <esp-cam />
    <v-row>
      <v-col cols="12">
        <v-list variant="elevated">
          <v-list-item
            v-for="r in store.recipeList"
            :key="r.recipeName"
            :title="r.recipeName"
            :subtitle="r.id"
          >
            <template v-slot:append>
              <v-btn variant="elevated" rounded="pill" size="small">
                <v-icon color="orange">mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card height="400px">
          <v-img
            class="align-end text-white"
            :src="store.recipe.imageSrc"
            cover
            height="200px"
          >
            <v-card-title>
              {{ store.recipe.recipeName }} aus dem Pinia Store 🍍

              <v-btn variant="tonal" size="small" icon class="float-right">
                <v-icon size="small" color="orange">mdi-pencil</v-icon>
                <v-dialog v-model="dialog" width="50%" activator="parent">
                  <v-card>
                    <v-card-text>
                      Dialog
                    </v-card-text>
                    <v-text-field v-model="store.recipe.recipeName" />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn small @click="dialog = !dialog">close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </v-card-title>
          </v-img>
          <v-row>
            <v-col cols="12" md="5">
              <v-list density="compact">
                <v-list-item
                  v-for="(item, index) in store.recipe.ingredients"
                  :key="index"
                >
                  <template v-slot:prepend>
                    {{ item.menge }}
                  </template>
                  <v-list-item-title class="ml-3">
                    {{ item.name }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="7">
              <v-card-text
                v-for="step in store.recipe.recipeDescription"
                :key="step.nr"
              >
                <div>Schritt {{ step.nr }}</div>
                {{ step.text }}
              </v-card-text>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <recipe-preview-card :recipe="recipe" />
      </v-col>
      <v-col cols="12">
        <recipes-view :recipes="recipeArray" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tags-select v-model="recipe" />
        rezept in dev: {{ recipe }}
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import { ref, reactive, onBeforeMount } from "vue";
import RecipesView from "@/components/componenttest/RecipesView.vue";
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";
import imgUrl from "@/assets/whisky.jpg";
import { useDevStore } from "@/components/componenttest/devStore";
import EspCam from "@/components/componenttest/EspCam.vue";


const dialog = ref(false);
const store = useDevStore();
const recipe = reactive({
  recipeName: "rezept 1",
  img: imgUrl,
  createdBy: "Petzi",
  tags: ["deftig"],
});
const recipeArray = ref([recipe]);

onBeforeMount(()=> store.initRecipes())
</script>

<style scoped></style>
