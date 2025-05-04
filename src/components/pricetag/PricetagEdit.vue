<template>
  <v-row v-if="store.editmode">
    <v-col cols="12" md="12">
      <v-form ref="editform">
        <v-text-field
          label="Name"
          :rules="required"
          v-model="store.pricetag.productName"
        />
        <v-text-field
          label="Beschreibung"
          v-model="store.pricetag.description"
        />
        <v-text-field readonly :value="store.pricetag.imageUrl" />
        <pricetag-image-upload />
        <v-btn
          block
          variant="outlined"
          class="mb-3"
          @click="saveProduktUpdate"
          text="Produkt speichern"
        />
        <v-btn
          block
          color="red"
          variant="outlined"
          class="mb-3"
          @click="store.exitEdit()"
          text="Abbrechen"
        />
      </v-form>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import PricetagImageUpload from "@/components/pricetag/PricetagImageUpload.vue";
import { usePricetagLogic } from "@/components/pricetag/PricetagLogic";
const { store, required, saveProduktUpdate } = usePricetagLogic();
</script>
<style scoped></style>
