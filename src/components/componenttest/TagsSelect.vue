<template>
  <v-card>
    <v-card-title>Tags</v-card-title>
    <v-card-text>
      <v-form
        ref="tagform"
        @submit.prevent="addTagToRecipe"
        @keydown.tab="addTagToRecipe"
      >
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <v-text-field variant="outlined" v-model="recipe.recipeName" label="Rezept Name" />
          </v-col>
          <v-col cols="12"
                 md="5"
            ><v-autocomplete
              variant="outlined"
              id="searchField"
              multiple
              chips
              closable-chips
              :items="tagItems"
              v-model="recipe.tags"
              v-model:search="searchValue"
              hide-selected
              label="Tags"
              @click="getTagItems"
            ></v-autocomplete
          ></v-col>
          <v-col cols="2"><v-btn block variant="outlined" height="70%" rounded="0" type="submit">speichern</v-btn></v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-text>
      <ul>
        <li>searchValue: {{ searchValue }}</li>
        <li>model: {{ model }}</li>
        <li>rezept: {{ recipe }}</li>
      </ul>
      log: {{ message() }}
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

function message(value: string): string {
  setTimeout(() => {
    value = "asdfa"
  }, 1000)
  return "laksjdöflkjasdf";
}

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
  if (!searchValue.value) {
    message("leerer String");
    console.info("leerer String");
  } else {
    recipe.value.tags.push(searchValue.value);
  }

  searchValue.value = null;
}
</script>

<style scoped></style>
