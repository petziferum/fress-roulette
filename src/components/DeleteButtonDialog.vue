<template>
<v-dialog v-model="isOpen">
  <v-template v-slot:activator="{ on }">
    <v-btn v-on="on">Open Dialog</v-btn>
  </v-template>
  <v-card>
    <v-card-title>Möchtest du das Rezept löschen?</v-card-title>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" color="red" @click="cancel">abbrechen</v-btn>
      <v-btn variant="text" color="green" type="submit">weiter</v-btn>
  </v-card>
</v-dialog>
</template>
<script setup lang="ts">

import { ref } from "vue";

const isOpen = ref(false);

function cancel() {
  isOpen.value = false;
}
</script>
<style scoped>

</style>