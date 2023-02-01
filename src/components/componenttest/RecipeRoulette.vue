<template>
  <div>
    <v-card>
      <v-toolbar>
        <v-toolbar-items>
          <v-btn @click="getRandomItem">Pick One</v-btn>
          <v-btn @click="reset">Reset</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        {{ array }}<br />
        {{ show }}
        <v-card :color="bg" width="100px" height="100px">
          <v-row justify="center">
            <v-col cols="6" class="text-center">
              <transition name="slide" mode="out-in">
                <div v-if="show" :key="result">{{ result }}</div>
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

const array = ref<string[]>([]);
const result = ref();
const show = ref(false);
const bg = ref("red");

function getRandomItem() {
  bg.value = bg.value === "red" ? "black" : "red";
  show.value = false;
  const nr = Math.floor(Math.random() * array.value.length);
  console.log("value", nr);
  result.value = array.value[nr];
  array.value.splice(nr, 1);
  if (array.value.length <= 0) {
    reset();
  }
  show.value = true;
}

const reset = () => {
  show.value = false;
  array.value = ["1", "2", "3", "a2", "k82"];
};

onBeforeMount(() => {
  reset();
});
</script>
<style>
.slide-enter-from {
  transform: translateX(-50px);
  opacity: 0.3;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
