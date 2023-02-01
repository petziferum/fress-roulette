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
        <transition name="slide" mode="out-in">
          <p v-if="show" :key="result">{{ result }}</p>
        </transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const array = ref<string[]>([]);
const result = ref();
const show = ref(false);

function getRandomItem() {
  show.value = false;
  const nr = Math.floor(Math.random() * array.value.length);
  console.log("value", nr);
  result.value = array.value[nr];
  array.value.splice(nr, 1);
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
  transform: translateX(-300px);
  opacity: 0.3;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 1s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(300px);
  opacity: 0;
}
</style>
