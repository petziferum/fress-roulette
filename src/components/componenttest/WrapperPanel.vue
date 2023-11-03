<template>
  <v-expansion-panels model-value="0">
    <v-expansion-panel>
      <v-expansion-panel-title ripple>{{ title }}</v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script setup lang="ts">
defineProps(["title"]);
</script>
<style scoped>

</style>