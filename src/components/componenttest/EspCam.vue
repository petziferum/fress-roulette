<template>
  <v-row>
    <v-btn @click="capture">Capture</v-btn>
    <v-img v-if="!espLoading" :src="espImg" width="800" height="600" style="border: 1px solid black;" />
    <v-icon v-else>mdi-cactus</v-icon>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

const espLoading = ref(false);
const espImg = ref("");

async function capture(): Promise<void> {
  espLoading.value = true;
  console.log("capture");
  await fetch("http://192.168.1.23/capture")
    .then((response) => response.blob())
    .then((blob) => {
      console.log(blob, espLoading.value  );
      const streamURL = URL.createObjectURL(blob);
      espImg.value = streamURL;
      espLoading.value = false;
    })
    .catch((error) => {
      console.error(error);
      espLoading.value = false;
    });
  console.log("caption fertig");
}
</script>
<style scoped>

</style>