<template>
  <v-dialog v-model="isOpen" width="100%" max-width="100vw" max-height="100vh">
    <div class="d-flex justify-center align-center" style="height: 100vh; overflow: hidden;">
      <v-img :src="imageSrc" contain @click.stop="isOpen = false"></v-img>
    </div>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from "vue";

defineProps({
  imageSrc: String,
});
const isOpen = ref(false);
function open() {
  isOpen.value = true;
}
defineExpose({ open });
</script>
<style scoped></style>
