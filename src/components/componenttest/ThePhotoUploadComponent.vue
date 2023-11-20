<template>
  <v-container>
    <v-card>
      <v-card-title>PhotoUploadComponent</v-card-title>
      <v-card-text>
        <v-form>
          <v-file-input
            v-model="file"
            :rules="fileRules"
            accept="image/*"
            label="File input"
            outlined
            dense
          ></v-file-input>
          <v-btn @click="uploadFile">upload</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";
const file = ref(null);
const fileRules = [
  (v) => !!v || "File is required"
];
function uploadFile() {
  console.log("uploadFile");
  console.log(file.value);
}
</script>
<style scoped></style>
