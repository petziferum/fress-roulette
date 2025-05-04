<template>
  <v-row>
    <v-col cols="12">
      <v-card style="border: 1px solid">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <!-- Title Image -->
            <v-img
              v-bind="props"
              :src="store.pricetag.imageUrl"
              cover
              :height="isHovering ? '600px' : '300px'"
              class="mt-0 pt-0 image"
              @click="openImageOverlay"
            >
              <v-overlay
                :model-value="isHovering"
                class="align-center justify-center"
                scrim="#036358"
                contained
              >
                <v-icon size="large" class="text-white">mdi-eye</v-icon>
              </v-overlay>
            </v-img>
          </template>
        </v-hover>
        <ImageOverlay ref="imageOverlay" :imageSrc="store.pricetag.imageUrl" />

        <v-card-title
          >{{ store.pricetag.productName
          }}<v-btn
            flat
            icon="mdi-pencil"
            size="small"
            @click="store.editmode = true"
        /></v-card-title>
        <v-card-text>{{ store.pricetag.description }}</v-card-text>
        <v-card-text>
          <v-btn
            color="#000000"
            append-icon="mdi-plus"
            text="Tag hinzufügen"
            class="my-4"
            v-show="!store.addTagMode"
            @click="store.addTagMode = true"
          />
          <template v-if="store.addTagMode">
            <v-form ref="addtagform">
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
              <v-btn
                class="my-4"
                color="error"
                @click="store.addTagMode = false"
                text="abbrechen"
              />
              <v-btn
                class="my-4"
                color="success"
                @click="addPricetagEntry"
                text="Speichern"
              />
            </v-form>
          </template>
          <div class="d-flex flex-column">
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">Datum</th>
                  <th class="text-left">Markt</th>
                  <th class="text-left">Menge</th>
                  <th class="text-left">Preis</th>
                  <th class="text-left">Preis/kg</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tag, index) in store.pricetag.entries" :key="index">
                  <td>{{ tag.date.toDate().toLocaleDateString() }}</td>
                  <td>{{ tag.location }}</td>
                  <td>{{ tag.amount }}g</td>
                  <td>{{ tag.price }}</td>
                  <td>{{ getKiloPreis(tag.amount, tag.price) }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card-text>
        <div class="text-caption">
          Hier könnten ähnliche Produkte angezeigt werden.
        </div>
      </v-card-text>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import ImageOverlay from "@/components/commons/ImageOverlay.vue";
import { usePricetagLogic } from "@/components/pricetag/PricetagLogic";
const {
  store,
  getKiloPreis,
  required,
  addPricetagEntry,
  imageOverlay,
  openImageOverlay,
} = usePricetagLogic();
</script>
<style scoped></style>
