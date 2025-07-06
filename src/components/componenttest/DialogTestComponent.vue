<template>
  <v-btn @click="showImage">show image</v-btn>
  <ImageOverlay ref="imageOverlay" :image-src="image" />
</template>
<script setup lang="ts">
import ImageOverlay from "@/components/commons/ImageOverlay.vue";
import { ref } from "vue";
import whiskyImage from "@/assets/whisky.jpg";
const imageOverlay = ref(null);
const image = ref(whiskyImage);
function showImage() {
  console.log("image value", imageOverlay.value.isOpen);
  imageOverlay.value.open();
}
</script>
<style scoped></style>
