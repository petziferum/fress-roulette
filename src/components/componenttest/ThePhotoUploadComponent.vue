<template>
  <v-container>
    <v-card variant="outlined">
      <v-card-title>PhotoUploadComponent</v-card-title>
      <v-card-text>
        <v-form>
          <v-file-input
            ref="fileinput"
            :rules="fileRules"
            accept="image/*"
            label="File input"
            outlined
            dense
            @change="onFileInput"
          ></v-file-input>
          <v-btn @click="uploadImage">upload</v-btn>
          <v-alert v-if="uploadStatus" :color="uploadStatus.type" class="mt-4" dense dismissible>
            {{ uploadStatus.message }}
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-text v-if="fileinput">
        <div height="100px">
          <v-img
            style="border: 1px solid grey"
            aspect-ratio="1"
            max-width="100px"
            contain
            :src="imgsrc"
          ></v-img>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
interface UploadStatus {
  type: string;
  message: string;
}

import { ref } from "vue";
import { getStorage, ref as fireRef, uploadBytes } from "firebase/storage";
const fileRules = [(v) => !!v || "File is required"];
const fileinput = ref();
const storage = getStorage();
const uploadStatus = ref<UploadStatus | null>(null);
const loading = ref(false);
const imgsrc = ref("");
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 10MB
const folder = "recipes/";

const onFileInput = () => {
  const input = fileinput.value;
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];
    if (file.size > MAX_FILE_SIZE) {
      uploadStatus.value = { type: "error", message: "File too large!" };
      return;
    } else uploadStatus.value = { type: "success", message: `File selected with size: ${(file.size/ (1024 * 1024)).toFixed(2)} MB` };
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      imgsrc.value = e.target?.result as string;
    };
    fileReader.readAsDataURL(file);
  }
};
const uploadImage = async () => {
  const file = fileinput.value.files[0];
  const storageRef = fireRef(storage, folder + file.name);
  if (!file) {
    uploadStatus.value = { type: "error", message: "No file selected!" };
    return;
  }
  loading.value = true;
  try {
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
      uploadStatus.value = { type: "success", message: `File +${file.name}+ uploaded!"` };
    });
  } catch (error) {
    console.log("Fehler: ", error);
    uploadStatus.value = { type: "error", message: error.message };
  } finally {
    reset();
    loading.value = false;
  }
};
const reset = () => {
  fileinput.value = "";
  imgsrc.value = "";
  uploadStatus.value = null;
};
</script>
<style scoped></style>
