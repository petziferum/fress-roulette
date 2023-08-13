<template>
  <v-container fluid>
    TheRecipeDetailsView - {{ id.id }}
    <v-row>
      <v-col>
        loading: {{ loading }} -<br />
        <v-btn @click="loading = !loading">loading</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <template v-if="loading">
        <v-col>
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
          >
            <v-row>
              <v-col cols="12" md="4">
                <v-list>
                  <v-list-item v-for="z in recipe.ingredients" :key="z.nr">
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
            </v-row>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { recipeStore } from "@/stores/recipeStore";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Recipe from "@/components/Models/Recipe.class";

const id = defineProps(["id"]);
const editItemNumber = ref(null);
const edit = ref(true);
const editItemText = ref("");
const store = recipeStore();
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
  store.loadRecipeById(route.params.name);
  console.log("route params", route.params.name);
});

function cancel() {
  editItemNumber.value = null;
  editItemText.value = "";
}
</script>
<style scoped></style>
