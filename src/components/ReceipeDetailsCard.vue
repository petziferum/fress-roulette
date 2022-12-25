<template>
  <v-card elevation="3">
    <v-card-title>Rezept Name: {{ recipe.recipeName }}</v-card-title>
    <v-card-subtitle>
      <v-chip-group>
        <v-chip v-for="tag in recipe.tags" :key="tag" rounded="0" size="small">{{ tag }}</v-chip>
      </v-chip-group>
    </v-card-subtitle>
    <v-card-subtitle>createdBy: {{ recipe.createdBy }}</v-card-subtitle>
    <v-row class="mx-5">
      <v-col cols="12" md="6">
        Zutaten:
        <v-list variant="elevated">
          <v-list-item v-for="zutat in recipe.ingredients" :key="zutat.name">
            <v-list-item-title>{{ zutat.menge}}  {{ zutat.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="6">
        Beschreibung:
        <v-list variant="elevated">
          <v-list-item v-for="text in recipe.recipeDescription" :key="text.nr">
            <div>{{ text.text }}</div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Recipe from "@/components/Models/Recipe.class";

const props = defineProps({
  recipeName: { type: String, default: "Der Standard Titel" },
  recipe: Recipe,
  createdBy: String,
  modelValue: String,
});

const emitValue = defineEmits(["update:modelValue"]);

const suchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});
</script>

<style scoped></style>
