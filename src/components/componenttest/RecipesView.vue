<template>
  <v-row justify="center">
    <v-col cols="12" md="6" v-for="recipe in recipes" :key="recipe.recipeName">
      Rezept Details
      <receipe-card :recipe="recipe" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
//import { ref } from "vue";
import ReceipeCard from "@/components/ReceipeDetailsCard.vue";

const props = defineProps(["recipes"]);
const emitValue = defineEmits(["update:recipe"]);

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
