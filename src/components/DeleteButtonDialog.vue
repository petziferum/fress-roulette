<template>
  <v-dialog v-model="isOpen" width="50%">
    <template v-slot:activator>
      <v-btn variant="outlined" color="alert" @click="isOpen = true"
        >Delete</v-btn
      >
    </template>
    <v-card title="Möchtest du das Rezept löschen?">
      <v-card-text>
        Rezept mit folgender ID wird gelöscht:
        <p>{{ recipe.id }}</p>
        <p class="text-h6">{{ recipe.recipeName }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="red" @click="cancel">abbrechen</v-btn>
        <v-btn variant="text" color="green" @click="confirmDelete"
          >Löschen</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["recipe"]);
const emit = defineEmits(["deleteRecipe"]);

const isOpen = ref(false);

function cancel() {
  isOpen.value = false;
}

function confirmDelete() {
  isOpen.value = false;
  emit("deleteRecipe", props.recipe.id);
}
</script>
<style scoped></style>
