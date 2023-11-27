<template>
  <v-card variant="outlined">
    <v-card-title>Photo Selction</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn @click="getAllImages">get</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <div class="imageGrid">
        <div class="elevatetImage" v-for="img in imageList" :key="img">
          <v-img :src="img" cover></v-img>
        </div>
      </div>

    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import RecipeServiceApi from "@/api/recipeServiceApi";

const fileRules = [(v) => !!v || "File is required"];
const fileinput = ref();
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 10MB
const imageList = ref([]);

//load images from firebase storage
const getAllImages = () => {
  RecipeServiceApi.getAllRecipeImages()
    .then((res) => {
      imageList.value = res;
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
<style scoped>
.imageGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px; /* Adjust the gap between grid items */
}
.elevatetImage {
  display: flex;
  position: relative;
  border: 1px solid grey;
  margin: 5px;
  width: 100px;
  height: 100px;
}
</style>
