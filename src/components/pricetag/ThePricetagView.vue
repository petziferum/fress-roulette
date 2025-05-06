<template>
  <v-container class="mt-12">
    <v-card>
      <v-card-title>Preisliste</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="9">
            <v-form ref="combobox">
              <template v-if="store.suggestedProductNames.length > 0">
              <v-chip
                v-for="item in store.suggestedProductNames"
                :key="item"
                @click="getProductByName(item)"
                elevation="3"
              >
                {{ item }}
              </v-chip>
              </template>
              <v-combobox
                label="Produktname"
                v-model="store.searchName"
                :items="store.suggestedProductNames"
                item-title="productName"
                return-object
                @change="store.findProductname"
                @input="store.findProductname"
                auto-select-first
                clearable
                @click:clear="clearResult()"
                :rules="required"
              />
            </v-form>
          </v-col>
          <v-col cols="3">
            <v-btn block tile color="blue" height="70%" @click="searchProduct"
              >Suchen</v-btn
            >
          </v-col>
        </v-row>
        <PricetagRead v-if="lesemodus" />
        <PricetagCreate v-if="store.creationMode" />
        <PricetagEdit v-if="store.editmode" />
      </v-card-text>
      <v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { usePricetagLogic } from "@/components/pricetag/PricetagLogic";
import PricetagEdit from "@/components/pricetag/PricetagEdit.vue";
import PricetagRead from "@/components/pricetag/PricetagRead.vue";
import PricetagCreate from "@/components/pricetag/PricetagCreate.vue";
const {
  store,
  required,
  lesemodus,
  combobox,
  getProductByName,
  searchProduct,
  clearResult,
} = usePricetagLogic();
//Lade initiativ alle Produkte
store.loadAllProducts();
</script>
<style scoped>
.image {
  transition: height 0.5s ease-in-out;
  cursor: pointer;
}
</style>
