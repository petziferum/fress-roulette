<template>
  <v-card elevation="3">
    <v-card-title>Rezept Name: {{ recipe.recipeName }}</v-card-title>
    <v-img :src="recipe.imageSrc" width="100%" height="250" cover></v-img>
    <v-card-subtitle>
      <v-chip-group>
        <v-chip
          v-for="tag in recipe.tags"
          :key="tag"
          rounded="0"
          size="small"
          >{{ tag }}</v-chip
        >
      </v-chip-group>
    </v-card-subtitle>
    <v-card-subtitle>createdBy: {{ recipe.createdBy }}</v-card-subtitle>
    <v-row class="mx-5">
      <v-col cols="12" md="6">
        Zutaten:
        <v-list variant="elevated">
          <v-list-item v-for="zutat in recipe.ingredients" :key="zutat.name">
            <v-list-item-title
              >{{ zutat.menge }} {{ zutat.name }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="6">
        Beschreibung:
        <v-list variant="elevated">
          <v-list-item v-for="text in recipe.recipeDescription" :key="text.nr">
            <v-row>
              <v-col cols="1">{{ text.nr }}.</v-col>
              <v-col cols="10">
                <template v-if="editItemNumber === text.nr">
                  <v-textarea v-model="editItemText"></v-textarea>
                  <v-spacer />
                  <div style="text-align: right">
                    <v-btn class="mr-2" color="error" @click="cancel"
                      >Abbrechen</v-btn
                    >
                    <v-btn color="success" @click="save">Speichern</v-btn>
                  </div>
                </template>
                <template v-else>{{ text.text }} </template></v-col
              >
              <v-col cols="1">
                <template v-if="edit">
                  <v-btn icon @click="editStep(text.nr)"
                    ><v-icon small>mdi-pencil</v-icon></v-btn
                  >
                </template>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import Recipe from "@/components/Models/Recipe.class";

const props = defineProps({
  recipeName: { type: String, default: "Der Standard Titel" },
  recipe: Recipe,
  createdBy: String,
  modelValue: String,
});
const editItemNumber = ref(null);
const editItemText = ref("");
const edit = ref(true);

const emitValue = defineEmits(["update:modelValue"]);

const suchValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});

function save(): void {
  console.log("Save ist Wip");
}

function cancel() {
  editItemNumber.value = null;
  editItemText.value = "";
}

function editStep(nr): void {
  console.info("editStep", nr, props.recipe!.recipeDescription[nr - 1]);
  if (editItemNumber.value === nr) {
    cancel();
  } else {
    editItemNumber.value = nr;
    editItemText.value = props.recipe!.recipeDescription[nr - 1].text;
  }
}
</script>

<style scoped></style>
