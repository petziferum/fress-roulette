<template>
  <v-card variant="outlined">
    <v-card-title>Photo Selction</v-card-title>
    <v-card-text>
      <div class="imageGrid">
        <div class="elevatetImage" v-for="img in imageList" :key="img">
          <v-img :src="img" cover>
            <v-btn variant="tonal" block rounded="0" height="100%" @click="selectImageForRecipe(img)"></v-btn>
          </v-img>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useRecipeStore } from "@/stores/useRecipeStore";

const recipeStore = useRecipeStore();
const imageList = computed(()=> {
  return recipeStore.recipeImages;
});

onBeforeMount(() => {
  recipeStore.getAllRecipeImages();
});

function selectImageForRecipe(url: string) {
  recipeStore.updateRecipeImage(url);
}
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
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.29);
  margin: 5px;
  width: 100px;
  height: 100px;
}
</style>
