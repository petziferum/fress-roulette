<template>
  <v-card>
    <v-img :src="recipe.img" width="10%" />
    <v-card-title>{{ recipe.recipeName }}</v-card-title>
    <v-card-text>
      {{ recipe }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps(["recipe"]);
</script>

<style scoped></style>
