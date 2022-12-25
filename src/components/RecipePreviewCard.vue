<template>
<v-card>
  Preview Card
  <v-card-title>{{ recipe.recipeName }}</v-card-title>
</v-card>
</template>

<script setup lang=ts>
const props = defineProps(["recipe"]);
</script>

<style scoped>
</style>
