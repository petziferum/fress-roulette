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
              label="Tags"
              @click="getTagItems"
              @update:focused="addTagToRecipe"
            ></v-autocomplete
          ></v-col>
          <v-col cols="2">
            <v-btn block variant="outlined" height="70%" rounded="0" type="submit">Add</v-btn>
          </v-col>
        </v-row>
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
import { getCollection } from "@/plugins/firebase";
import { toast } from "vue3-toastify";

const props = defineProps(["modelValue"]);
const emitValue = defineEmits(["update:modelValue"]);
const tagform = ref();
const searchField = ref();
const tagItems = ref<string[]>(["erster Tag"]);
const searchValue = ref("");
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
  toast("Tag hinzugefügt: "+ searchValue.value);
  console.log("addTagToRecipe: ", searchValue.value);
  console.log("tagform value: ", searchField);
  if (!searchValue.value) {
    console.info("leerer String");
  } else {
    recipe.value.tags.push(searchValue.value);
  }
}
</script>

<style scoped></style>
