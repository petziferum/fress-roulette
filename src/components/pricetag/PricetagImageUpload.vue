<template>
  <v-row class="mb-2">
    <v-col cols="9">
      <v-file-upload
        icon="mdi-image"
        density="compact"
        v-model="photo"
      ></v-file-upload>
    </v-col>
    <v-col cols="3">
      <v-btn @click="uploadFile" color="blue" block height="100%">upload</v-btn>
    </v-col>
  </v-row>
  {{ store.pricetag.imageUrl }}
  <v-row class="mb-2">
    <v-col cols="12" md="12">
      <template v-if="!store.loading">
        <template v-if="store.uploadStatus.type == 'success'">
          <v-sheet class="pa-3" color="green"
            >Upload erfolgreich. Speichern nicht vergessen!</v-sheet
          >
        </template>
      </template>
      <div v-if="store.loading" class="text-h4 text-center">
        Uploading...
        <v-skeleton-loader height="60" color="primary" />
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { usePricetagStore } from "@/stores/PricetagStore";

const store = usePricetagStore();
const photo = ref<File>();

async function uploadFile() {
  if (
    photo.value != undefined &&
    (photo.value.type == "image/jpeg" ||
      photo.value.type == "image/png" ||
      photo.value.type == "image/webp")
  ) {
    await store.uploadImage(photo.value).then(() => (photo.value = null));
  } else {
    console.error("falscher Dateityp", photo.value.type);
    photo.value = null;
    return;
  }
}
</script>
<style scoped></style>
