<template>
  <div class="mx-2">
    <v-row justify="center">
      <v-col cols="4">
        <div
          class="text-h1"
          style="text-shadow: 0 0 11px rgba(255, 255, 255, 1)"
        >
          Dev Test View
        </div></v-col
      >
    </v-row>
    <v-row class="my-2">
      <v-col>
        <v-btn @click="closePanels">Close all Panels</v-btn>{{ panels }}
      </v-col>
    </v-row>
    <v-expansion-panels v-model="panels">
      <wrapper-panel title="Fallout Console">
        <fallout-console />
      </wrapper-panel>
      <wrapper-panel title="datum test">
        v-calendar
        <v-card v-if="clickedDate" color="blue" :title="formattedDate">
          clickedDate: {{ clickedDate }} <br />
          formatedDate: {{ formattedDate }}
        </v-card>
        <v-calendar @click:date="clickDate"></v-calendar>
      </wrapper-panel>
      <wrapper-panel title="getWeather">
        <weather-component />
      </wrapper-panel>
      <wrapper-panel title="Pricetag Test">
        <pricetag-test-component />
      </wrapper-panel>
      <wrapper-panel title="Dialog Test">
        <dialog-test-component />
      </wrapper-panel>
      <wrapper-panel title="Hover Card">
        <hover-card-effect />
        <hover-card-effect />
      </wrapper-panel>
      <wrapper-panel title="filterChips">
        <v-row>
          <v-col>
            <filter-chip-test-component :recipeList="recipeArray" />
          </v-col>
        </v-row>
        <v-row>
          <v-col> rezept in dev: {{ recipeArray }} </v-col>
        </v-row>
      </wrapper-panel>
      <wrapper-panel title="Firestore löschen">
        <v-btn>löschen</v-btn>
      </wrapper-panel>
      <wrapper-panel title="Foto Upload">
        <the-photo-upload-component />
      </wrapper-panel>
      <wrapper-panel title="Recipe Table">
        <recipe-table :items="store.getSortedRecipeList" />
      </wrapper-panel>
      <wrapper-panel title="Esp Wled">
        <esp-wled />
      </wrapper-panel>
      <wrapper-panel title="Esp Cam">
        <esp-cam />
      </wrapper-panel>
      <wrapper-panel title="Rezept Liste">
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
      </wrapper-panel>
      <wrapper-panel title="Rezpet Card">
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
                        <v-card-text> Dialog</v-card-text>
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
                        {{ item.name }}
                      </v-list-item-title>
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
      </wrapper-panel>
      <wrapper-panel title="Preview Card">
        <v-row>
          <v-col>
            <recipe-preview-card :recipe="recipe" />
          </v-col>
          <v-col cols="12">
            <recipes-view :recipes="recipeArray" />
          </v-col>
        </v-row>
      </wrapper-panel>
      <wrapper-panel title="Edit Props">
        <v-row>
          <v-col>
            <tags-select v-model="recipe" />
            rezept in dev: {{ recipe }}
          </v-col>
        </v-row>
      </wrapper-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import { ref, reactive, onBeforeMount, computed } from "vue";
import RecipesView from "@/components/componenttest/RecipesView.vue";
import RecipePreviewCard from "@/components/RecipePreviewCard.vue";
import imgUrl from "@/assets/whisky.jpg";
import { useDevStore } from "@/components/componenttest/devStore";
import EspCam from "@/components/componenttest/EspCam.vue";
import EspWled from "@/components/componenttest/EspWled.vue";
import WrapperPanel from "@/components/componenttest/WrapperPanel.vue";
import RecipeTable from "@/components/componenttest/RecipeTable.vue";
import ThePhotoUploadComponent from "@/components/componenttest/ThePhotoUploadComponent.vue";
import FilterChipTestComponent from "@/components/componenttest/FilterChipTestComponent.vue";
import HoverCardEffect from "@/components/componenttest/HoverCardEffect.vue";
import DialogTestComponent from "@/components/componenttest/DialogTestComponent.vue";
import PricetagTestComponent from "@/components/componenttest/PricetagTestComponent.vue";
import WeatherComponent from "@/components/componenttest/WeatherComponent.vue";
import { format } from "date-fns";
import FalloutConsole from "@/components/console/fallout-console.vue";
import Recipe from "@/components/Models/Recipe.class";

const dialog = ref(false);
const panels = ref([0]);
const store = useDevStore();
const recipe = ref(
  Recipe.createEmptyRecipe()
    .withRecipeName("Erbsensuppe")
    .withDescription("Erbsen die in Suppe schwimmen. Igitt!")
    .withRating(2.1)
    .withTags(["Erbsen", "Suppe"])
);
const recipeArray = ref([recipe]);
const clickedDate = ref<string | null>(null);
const formattedDate = computed(() =>
  clickedDate.value ? format(new Date(clickedDate.value), "dd.MM.yyyy") : ""
);

const closePanels = () => {
  panels.value = [];
};
function clickDate(nativeEvent, { date }) {
  console.log("clickDate", nativeEvent);
  console.log("date", date);
  clickedDate.value = date;
}
onBeforeMount(() => store.initRecipes());
</script>

<style scoped></style>
