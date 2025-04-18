<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-btn icon @click="loadPricetagList">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <ul>
          <li v-for="(item, index) in pricetagList" :key="index">
            <v-list-item>
              <v-list-item-title>{{ item.productName }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
            </v-list-item>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { useDevStore } from "@/components/componenttest/devStore";
import { ref } from "vue";
import Pricetag from "@/components/pricetag/Pricetag";

const store = useDevStore();
const pricetagList = ref([]);

const loadPricetagList = () => {
  pricetagList.value = Array.from({ length: 10 }, (_, i) =>
    Pricetag.createEmptyPricetag()
      .withProductName("Test" + i)
      .withDescription("test" + i)
  );
};
</script>
<style scoped></style>
