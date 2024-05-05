<template>
  <v-dialog v-model="isOpen" width="100%">
    <v-img :src="imageSrc" cover @click.stop="isOpen = false"></v-img>
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
