<template>
  <v-container>
    <v-autocomplete :items="difficulty" item-title="value" label="Schwierigkeit"/>
  </v-container>
  <v-table class="elevation-8">
    <thead>
      <tr>
        <th><b>Name</b></th>
        <th><b>Schwierigkeit</b></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.recipeName }}</td>
        <td>{{ DifficultyToDescription.get(item.difficulty) }}</td>
      </tr>
    </tbody></v-table
  >
</template>
<script setup lang="ts">
import { ref } from "vue";
import { DifficultyToRecord, DifficultyToDescription } from "@/components/Models/Difficulty";
defineProps({items: Array});
const difficulty = ref(DifficultyToRecord);
</script>
<style scoped></style>
