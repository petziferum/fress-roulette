<template>
  <v-card elevation="3">
    <v-card-title>rezept {{ title }}</v-card-title>
    <v-card-text>{{ recipe}}</v-card-text>
  </v-card>
</template>

<script lang=ts setup>
interface Recipe {
  recipeName: string
}

defineProps({
  title: { type: String, default: "Der Standard Titel" },
  recipe: String,
});

</script>

<style scoped>

</style>
