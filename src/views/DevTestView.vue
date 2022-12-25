<template>
  <div class="mx-2">
    <v-row>
      <v-col> Dev Test View </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tags-select v-model="recipe" />
        rezept in dev: {{ recipe }}
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import TagsSelect from "@/components/componenttest/TagsSelect.vue";
import { ref } from "vue";

const recipe = ref({
  name: "rezept 1",
  tags: [],
});
</script>

<style scoped></style>
