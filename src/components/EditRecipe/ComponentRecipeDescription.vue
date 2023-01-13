<template>
  <v-row>
    <v-col>
      <v-sheet v-for="(step, i) in recipe.recipeDescription" :key="step.nr">
        <v-row :key="i">
          <v-col cols="9">
            <v-textarea
              background-color="white"
              height="100px"
              outlined
              :label="step.nr + '. Schritt'"
              v-model="step.text"
              :rules="filledRule"
              prepend-icon="mdi-minus"
              @click:prepend="deleteStep(i)"
              append-inner-icon="mdi-pencil"
            ></v-textarea>
            <v-btn
              v-if="step.nr != recipe.recipeDescription.length"
              color="white"
              height="18px"
              class="rounded-b-pill"
              tile
              style="position: relative; top: -35px; left: 45%"
              @click="addStepBetween(step.nr)"
              :key="`${i}+addStep`"
              >+
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-form ref="addStepForm" @submit.prevent="addStep">
        <v-textarea
          background-color="white"
          height="100px"
          outlined
          label="Beschreibung"
          name="text"
          class="mx-0"
          :rules="filledRule"
        >
        </v-textarea>
        <v-btn block rounded="0" color="success" type="submit"
          >Schritt hinzufügen</v-btn
        >
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VForm } from "vuetify/components";

const props = defineProps(["modelValue"]);
const emitValue = defineEmits(["update:modelValue", "add"]);
const addStepForm = ref<typeof VForm>();
const filledRule = ref([
  (v) => v != null || "Beschreibung muss ausgefüllt sein",
]);

const recipe = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emitValue("update:modelValue", value);
  },
});

async function addStep() {
  const { valid } = await (addStepForm.value || VForm).validate();
  const text = addStepForm.value?.text.value;
  console.log("text", text);
  if (valid) {
    const x = {
      nr: recipe.value.recipeDescription.length + 1,
      text: text,
      img: "",
    };
    recipe.value.recipeDescription.push(x);
    addStepForm.value?.reset();
  }
}

function addStepBetween(nr: number) {
  console.log("nr", nr);
  console.log("länge", recipe.value.recipeDescription.length);
  recipe.value.recipeDescription.splice(nr, 0, {
    nr: nr + 1,
    text: "",
    img: "",
  });
  for (let i = nr + 1; i < recipe.value.recipeDescription.length; i++) {
    console.log("bearbeiten ", i);
    recipe.value.recipeDescription[i].nr += 1;
  }
  console.log(recipe.value.recipeDescription[nr]);
}

function deleteStep(n: number) {
  if (recipe.value.recipeDescription.length > 1) {
    recipe.value.recipeDescription.splice(n, 1);
  }
}
</script>

<style scoped></style>
