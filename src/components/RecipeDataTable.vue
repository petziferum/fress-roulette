<template>
  <v-data-table
    :headers="headers"
    :items="userRecipes"
    :items-per-page="-1"
    :sort-by="sortBy"
    class="elevation-1"
    width="100%"
  >
    <template v-slot:item.image="{ item }">
      <v-img
        :src="item.imageSrc"
        width="50"
        height="50"
        cover
        lazy-src="https://picsum.photos/50/50/?random"
      ></v-img>
    </template>
    <template v-slot:item.action="{ item }">
      <v-btn icon @click="editRecipe(item.id)"
        ><v-icon small>mdi-pencil</v-icon></v-btn
      >
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort";

defineProps({ userRecipes: Array });
const emit = defineEmits(["editRecipe"]);
const sortBy = ref<SortItem[]>([{ key: "recipeName", order: "asc" }]);
const headers = [
  { title: "Bild", key: "image" },
  { title: "Rezept Name", key: "recipeName" },
  { title: "Autor", key: "createdBy.name" },
  { title: "Bearbeiten", key: "action" },
];

function editRecipe(id: string): void {
  emit("editRecipe", id);
}
</script>
<style scoped></style>
