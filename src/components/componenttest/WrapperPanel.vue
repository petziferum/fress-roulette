<template>
  <v-expansion-panel>
    <v-expansion-panel-title ripple>{{ title }}</v-expansion-panel-title>
    <v-expansion-panel-text>
      <slot></slot>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<script setup lang="ts">
defineProps(["title"]);
</script>
<style scoped></style>
