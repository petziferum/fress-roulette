<template>
  <v-btn @click="showImage">show image</v-btn>
  <ImageOverlay ref="imageOverlay" />
</template>
<script setup lang="ts">
import ImageOverlay from "@/components/commons/ImageOverlay.vue";
import { ref } from "vue";
const imageOverlay = ref(null);

function showImage() {
  console.log("image value", imageOverlay.value.isOpen);
  imageOverlay.value.open();
}
</script>
<style scoped></style>
