<template>
  <v-container>
    <v-autocomplete
      :items="difficulty"
      item-title="value"
      label="Schwierigkeit"
    />
    <v-text-field label="suche" v-model="store.searchQuery" />
  </v-container>
  {{ store.loading }}
  <v-table class="elevation-8" v-if="!store.loading" translate="yes">
    <thead>
      <tr>
        <th><b>Name</b></th>
        <th><b>Schwierigkeit</b></th>
        <th><b>Rating</b></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.recipeName }}</td>
        <td>{{ DifficultyToDescription.get(item.difficulty) }}</td>
        <td>{{ item.rating }}</td>
      </tr>
    </tbody></v-table
  >
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  DifficultyToRecord,
  DifficultyToDescription,
} from "@/components/Models/Difficulty";
import { useDevStore } from "@/components/componenttest/devStore";
defineProps({ items: Array });
const difficulty = ref(DifficultyToRecord);

const store = useDevStore();
</script>
<style scoped></style>
