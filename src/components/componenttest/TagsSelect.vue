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
            <v-text-field
              variant="outlined"
              v-model="recipe.recipeName"
              label="Rezept Name"
            />
          </v-col>
          <v-col cols="12" md="5"
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
            <v-btn
              block
              variant="outlined"
              height="70%"
              rounded="0"
              type="submit"
              >Add</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { db, getCollection } from "@/plugins/firebase";
import { updateDoc, doc } from "firebase/firestore";
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

function addTagToRecipe(): void {
  if (!searchValue.value) {
    return;
  } else {
    handleNewTag(searchValue.value);
    recipe.value.tags.includes(searchValue.value)
      ? recipe.value.tags
      : recipe.value.tags.push(searchValue.value);
    toast("Tag zu Rezept hinzugefügt: " + searchValue.value);
  }
}

function handleNewTag(inputTag: string): void {
  if (inputTag === "") return;
  const newTag = !tagItems.value.includes(inputTag);
  if (newTag) {
    saveTagToFirestoreCollection(inputTag);
  }
}

function saveTagToFirestoreCollection(newTag: string): void {
  const tagDoc = doc(db, "tags", "allTags");
  updateDoc(tagDoc, {
    tags: [...tagItems.value, newTag],
  }).then(() => {
    toast("Neuer Tag '" + newTag + "' in Firebase gespeichert");
    getTagItems();
  });
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
</script>

<style scoped></style>
