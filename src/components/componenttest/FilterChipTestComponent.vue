<template>
  <v-card title="Filter Chips">
    <v-row>
      <v-col>
        <filter-chips
          :selected="selectedTags"
          :status-ount="statusCount"
          :filter-items="recipeTags"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        statusCount: {{ statusCount }}<br />
        Rezepte: {{ recipeList }} <br />
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import filterChips from "@/components/componenttest/FilterChips.vue";
import type Recipe from "@/components/Models/Recipe.class";

const props = defineProps(["recipeList"]);
const selectedTags = ref(["Abendessen"]);
const recipeTags = ref(["Abendessen", "Deftig", "Süß", "Vietnamesisch"]);
// eslint-disable-next-line no-undef
const statusCount = computed(() => {
  const map = new Map(
    Object.keys(recipeTags).map((value) => {
      const pValue = value;
      return [
        pValue,
        props.recipeList.value.filter(
          (value1: Recipe) => value1.tags[0] === pValue
        ).length,
      ];
    })
  );
  return map;
});
</script>
<style scoped></style>
