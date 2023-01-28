<template>
  <v-app-bar
    floating
    order="1"
    height="200"
    :image="barImg"
    class="align-content-center text-white"
  >
    <v-spacer />
    <v-sheet class="myTitleBar">
      <v-img
        :src="titleImg"
        class="pa-10 ma-10"
        height="150px"
        style="cursor: pointer"
        @click="$router.push('/')"
      />
    </v-sheet>
    <v-spacer />
  </v-app-bar>
</template>

<script setup lang="ts">
const barImg = "/src/assets/whisky.jpg";
const titleImg = "/src/assets/TITLE.png";
</script>

<style scoped>
.myTitleBar {
  display: table;
  vertical-align: middle;
  padding: 12px;
  height: 80%;
  width: 50%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 7px 7px 20px rgba(252, 185, 15, 0.5);
  border-radius: 10px;
  font-weight: bolder;
}
</style>
