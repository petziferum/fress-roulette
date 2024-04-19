<template>
  <div
    class="fullwidth rounded shadow-2xl"
    ref="target"
    :style="{ transform: cardTransform, transition: 'transform 0.25 ease-out' }"
  >
    <h4>Hover Card</h4>
    <span>Hover over me</span>
  </div>
  {{ cardTransform }}
</template>
<script setup lang="ts">
import { useMouseInElement } from "@vueuse/core";
import { computed, ref } from "vue";

const target = ref(null);
const cardTransform = computed(() => {
  const MAX_ROTATION = 8;
  const rX = (
    MAX_ROTATION / 2 -
    (elementY.value / elementHeight.value) * MAX_ROTATION
  ).toFixed(2);
  const rY = (
    MAX_ROTATION / 2 -
    (elementX.value / -elementWidth.value) * MAX_ROTATION
  ).toFixed(2);
  return `perspective(${elementWidth.value}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
});
const { elementX, elementY, isOutside, elementHeight, elementWidth } =
  useMouseInElement(target);
</script>
<style scoped>
.fullwidth {
  border-radius: 5px;
  padding: 20px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.24);
  background-color: #2c3e50;
  width: 300px;
  height: 250px;
  color: white; /* Add this line to change the text color to white */
}
</style>
