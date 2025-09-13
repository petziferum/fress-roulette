<template>
  <v-container class="mt-0 pa-0" width="100%">
    <v-card>
      <v-card-title>Preisliste</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="9">
            <v-form ref="combobox">
              <template v-if="store.suggestedProductNames.length > 0">
                <div class="text-caption text-medium-emphasis mb-1">
                  Vorschläge
                </div>
                <v-sheet
                  class="pa-1 rounded"
                  color="transparent"
                  role="listbox"
                  aria-label="Vorgeschlagene Produktnamen"
                  style="max-height: 160px; overflow: auto"
                >
                  <v-slide-y-transition
                    group
                    tag="div"
                    class="d-flex flex-wrap gap-2"
                  >
                    <v-chip
                      v-for="item in visibleNames"
                      :key="item"
                      role="option"
                      @click="getProductByName(item)"
                      @keyup.enter="getProductByName(item)"
                      tabindex="0"
                      variant="tonal"
                      color="primary"
                      size="small"
                      class="mb-2 me-2 text-truncate"
                      :ripple="true"
                    >
                      <v-tooltip activator="parent" location="top">{{
                        item
                      }}</v-tooltip>
                      {{ item }}
                    </v-chip>

                    <v-chip
                      v-if="overflowCount > 0"
                      key="more-chip"
                      color="primary"
                      variant="outlined"
                      size="small"
                      class="mb-1 me-0"
                      @click="showAllSuggestions = !showAllSuggestions"
                      @keyup.enter="showAllSuggestions = !showAllSuggestions"
                      tabindex="0"
                      :ripple="true"
                      aria-label="Weitere Vorschläge anzeigen"
                    >
                      +{{ overflowCount }} weitere
                    </v-chip>
                  </v-slide-y-transition>
                </v-sheet>
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
                @update:modelValue="onComboboxUpdate"
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
      <v-card-text v-if="!lesemodus && !store.editmode && !store.creationMode">
        Suche nach einem Produkt.
        <v-skeleton-loader type="paragraph" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { usePricetagLogic } from "@/components/pricetag/PricetagLogic";
import PricetagEdit from "@/components/pricetag/PricetagEdit.vue";
import PricetagRead from "@/components/pricetag/PricetagRead.vue";
import PricetagCreate from "@/components/pricetag/PricetagCreate.vue";
import { computed, ref } from "vue";
const {
  store,
  required,
  lesemodus,
  combobox,
  getProductByName,
  searchProduct,
  clearResult,
} = usePricetagLogic();

// Progressive Anzeige der Chips
const MAX_CHIPS = 12;
const visibleNames = computed(() =>
  store.suggestedProductNames.slice(0, MAX_CHIPS)
);
const overflowCount = computed(
  () => Math.max(0, store.suggestedProductNames.length - MAX_CHIPS)
);

const showAllSuggestions = ref(true);

// Nur bei echter Auswahl aus der Vorschlagsliste laden
function onComboboxUpdate(value: unknown) {
  // Wenn return-object aktiv ist (Objekt mit productName)
  if (value && typeof value === "object" && "productName" in (value as any)) {
    const name = (value as any).productName as string;
    if (store.suggestedProductNames.includes(name)) {
      getProductByName(name);
    }
    return;
  }
  // Falls Strings genutzt werden
  if (typeof value === "string") {
    if (store.suggestedProductNames.includes(value)) {
      getProductByName(value);
    }
  }
}

//Lade initiativ alle Produkte
store.loadAllProducts();
</script>
<style scoped>
.image {
  transition: height 0.5s ease-in-out;
  cursor: pointer;
}
.gap-2 {
  gap: 4px;
}

</style>
