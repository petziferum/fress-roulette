<template>
  <v-row v-if="store.creationMode">
    <v-col cols="12" md="12">
      <v-card-title class="text-h4">Neues Produkt</v-card-title>
      <v-form ref="createform">
        <v-text-field
          label="Name"
          :rules="required"
          v-model="store.pricetag.productName"
        />
        <v-text-field
          label="Beschreibung"
          v-model="store.pricetag.description"
        />
        <v-select
          :items="store.marktItems"
          label="Markt"
          v-model="store.pricetagEntryEdit.location"
        />
        <v-text-field
          label="Menge in g"
          v-model="store.pricetagEntryEdit.amount"
          suffix="g"
        />
        <v-text-field
          label="Preis"
          :rules="required"
          v-model="store.pricetagEntryEdit.price"
        />
        <v-text-field readonly label="datum" v-model="store.formattedDate" />
        <v-text-field readonly :value="store.pricetag.imageUrl" />
        <PricetagImageUpload />
        <v-btn
          block
          color="red"
          variant="outlined"
          class="mb-3"
          @click="store.creationMode = false"
          text="Abbrechen"
        />
        <v-btn
          block
          variant="outlined"
          @click="saveNewProduct"
          text="Speichern"
        />
      </v-form>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import PricetagImageUpload from "@/components/pricetag/PricetagImageUpload.vue";
import { usePricetagLogic } from "@/components/pricetag/PricetagLogic";
const { store, saveNewProduct, createform, required } = usePricetagLogic();
</script>
<style scoped></style>
