<template>
  <v-card elevation="3">
    <v-card-title>Rezept Name: {{ recipeName }}</v-card-title>
    <v-card-text>createdBy: {{ createdBy }}</v-card-text>
    <v-text-field label="beschreibung" v-model="suchValue"></v-text-field>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Recipe {
  recipeName: string;
  createdBy: string;
}

const props = defineProps({
  recipeName: { type: String, default: "Der Standard Titel" },
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
