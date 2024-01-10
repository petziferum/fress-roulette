<template>
  <v-row>
    <v-col>
      <filter-chip-test-component
        :selected="selectedTags"
        :status-ount="statusCount"
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";

const selectedTags = ref(["Abendessen"]);

// eslint-disable-next-line no-undef
const statusCount = computed(() => {
  /*
  const map = new Map(
    Object.keys(productStatus).map(value => {
      const pValue = productStatus[value];
      return [pValue, productList.value.filter((value1: Product) => value1.statusChanges[0].status === pValue).length];
    })
  );
  return map;
   */
  return new Map([
    ["AVAILABLE", 1],
    ["ORDER", 2],
    ["INSTOCK", 3],
    ["UNAVAILABLE", 4],
  ]);
});
</script>
<style scoped></style>
