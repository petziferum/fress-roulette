<template>
  <v-dialog v-model="isOpen" persistent max-width="100%">
    <v-card>
      <v-img :src="imageSrc" cover @click.stop="isOpen = false"></v-img>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";

defineProps({
  imageSrc: String,
  isOverlayVisible: Boolean,
});

const isOpen = ref(false);
</script>
<style scoped></style>
