<template>
  <v-card>
    <v-card-title>Tags</v-card-title>
    <v-card-text>
      <v-form ref="tagform" @submit.prevent="addTag">
        <v-autocomplete
          multiple
          chips
          :items="tagItems"
          v-model:search="tagValue"
          hide-selected
          label="Tags"
        ></v-autocomplete>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tagItems = ref<string[]>(["erster Tag"]);
const tagValue = ref("");

function addTag(): void {
  console.log("add ");
}
</script>

<style scoped></style>
