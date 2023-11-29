<template>
<v-dialog v-model="isOpen">
  <template v-slot:activator="{ on }">
    <v-btn variant="outlined" color="alert" v-on="on">Delete</v-btn>
  </template>
  <v-card>
    <v-card-title>Möchtest du das Rezept löschen?</v-card-title>
    <v-card-text>
      Rezept mit folgender ID wird gelöscht:
      <p>{{ recipe }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" color="red" @click="cancel">abbrechen</v-btn>
      <v-btn variant="text" color="green" @click="confirmDelete">Löschen</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">

import { ref } from "vue";

const props = defineProps(["recipe"]);

const isOpen = ref(false);

function cancel() {
  isOpen.value = false;
}

function confirmDelete() {
  console.log("confirmDelete");
  isOpen.value = false;
  emit("deleteRecipe", props.recipe);
}
</script>
<style scoped>

</style>