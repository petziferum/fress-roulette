<template>
  <v-card>
    <v-card-title>Tags</v-card-title>
    <v-card-text>
      <v-form
        ref="tagform"
        @submit.prevent="addTagToRecipe"
        @keydown.tab="addTagToRecipe"
      >
        <v-autocomplete
          id="searchField"
          multiple
          chips
          closable-chips
          :items="tagItems"
          v-model="recipe.tags"
          v-model:search="searchValue"
          return-object
          hide-selected
          label="Tags"
          @click="getTagItems"
        ></v-autocomplete>
        <v-spacer />
        <v-btn type="submit">speichern</v-btn>
      </v-form>
    </v-card-text>
    <v-card-text>
      <ul>
        <li>searchValue: {{ searchValue }}</li>
        <li>model: {{ model }}</li>
        <li>rezept: {{ recipe }}</li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { db, getCollection } from "@/plugins/firebase";

const props = defineProps(["modelValue"]);
const emitValue = defineEmits(["update:modelValue"]);

const tagItems = ref<string[]>(["erster Tag"]);
const searchValue = ref();
const model = ref();

const recipe = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});

function getTagItems(): void {
  console.log("getTagItems");
  getCollection("tags").then((res) => {
    tagItems.value = [];
    res.forEach((tag) => {
      const tags = tag.data();
      tagItems.value = tags.tags;
    });
  });
}

function addTagToRecipe(): void {
  console.log("add ", searchValue.value);
  if(!searchValue.value){
    console.info("leerer String")
  } else {
    recipe.value.tags.push(searchValue.value);
  }

  searchValue.value = null;
}
</script>

<style scoped></style>
