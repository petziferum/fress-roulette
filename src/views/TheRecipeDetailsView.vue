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
        <v-col v-if="!loading">
          <div v-if="recipe">{{ recipe }}</div>
          <div v-else>Kein Rezept geladen...</div>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { recipeStore } from "@/stores/recipeStore";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const id = defineProps(["id"]);
const store = recipeStore();
const recipe = ref(store.viewRecipe);
const loading = computed({
  get() {
    return store.getLoadingState;
  },
  set(value) {
    store.recipesLoading = value;
  },
});
onBeforeMount(function () {
  store.loadRecipeById(id.id);
  const route = useRoute();
  console.log("route params", route.params.id);
});
</script>
<style scoped></style>
