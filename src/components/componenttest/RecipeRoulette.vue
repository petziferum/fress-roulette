<template>
  <div>
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn @click="getRandomItem">Start</v-btn>
          <v-btn @click="reset">Reset</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <div v-if="recipesArray.length">{{ recipesArray.length }} Rezepte</div>
        <v-card :color="bg" width="300px" height="100px">
          <v-img v-if="result.img" width="100%" :src="result.img" />
          <v-row justify="center">
            <v-col cols="6" class="text-center">
              <div class="text-amber-darken-2">Heute gibts:</div>
              <transition name="slide" mode="out-in">
                <div v-if="show" :key="result">{{ result.recipeName }}</div>
              </transition>
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import Recipe from "@/components/Models/Recipe.class";

const props = defineProps(["recipesArray"]);
//const emitValue = defineEmits(["update:recipesArray"]);

const array = ref<[]>(Object.assign([], props.recipesArray));
const result = ref<Recipe>();
const show = ref(false);
const bg = ref("red");

function getRandomItem() {
  if (props.recipesArray) {
    console.log(
      "props length: ",
      props.recipesArray.length,
      "array length",
      array.value.length
    );
    bg.value = bg.value === "red" ? "black" : "red";
    show.value = false;
    const nr = Math.floor(Math.random() * array.value.length);
    console.log("value", nr, array.value[nr]);
    result.value = array.value[nr];
    array.value.splice(nr, 1);
  }
  if (array.value.length <= 0) {
    reset("Das waren alle Rezepte! \n Zum beginnen auf Start klicken.");
  }
  show.value = true;
}

const reset = (text: string) => {
  console.debug("reset");
  show.value = true;
  array.value = Object.assign([], props.recipesArray);
  result.value = Recipe.createEmtptyRecipe().withRecipeName(text);
  console.debug("array", array.value.length, result.value);
};

onBeforeMount(() => {
  reset("Auf Start klicken");
});
</script>
<style>
.slide-enter-from {
  transform: translateX(50px);
  opacity: 0.3;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
