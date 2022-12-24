<template>
  <v-app>
    <side-bar></side-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import SideBar from "@/components/SideBar.vue";
</script>
