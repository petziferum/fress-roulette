<template>
  <v-card elevation="3">
    <v-card-title>rezept {{ title }}</v-card-title>
    <v-card-text>recipe: {{ recipe}}</v-card-text>
    <v-card-text>modelValue: {{ modelValue }}</v-card-text>
  </v-card>
</template>

<script lang=ts setup>
interface Recipe {
  recipeName: string
}

defineProps({
  title: { type: String, default: "Der Standard Titel" },
  recipe: String,
  modelValue: String
});

defineEmits(['update:modelValue'])

</script>

<style scoped>

</style>
