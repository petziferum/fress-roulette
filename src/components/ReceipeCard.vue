<template>
  <v-card elevation="3">
    <v-card-title>rezept {{ title }}</v-card-title>
    <v-card-text>recipe: {{ recipe}}</v-card-text>
    <v-text-field label="beschreibung" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"></v-text-field>
  </v-card>
</template>

<script lang=ts setup>
import {computed} from "vue";

interface Recipe {
  recipeName: string
}

defineProps({
  title: { type: String, default: "Der Standard Titel" },
  recipe: String,
  modelValue: String
});

defineEmits(["update:modelValue"]);

</script>

<style scoped>

</style>
