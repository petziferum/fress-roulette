<template>
  <v-container class="mt-12">
    <v-card>
      <v-card-title>Preisliste</v-card-title>
      <v-row no-gutters>
        <v-col cols="9">
          <v-form ref="combobox">
            <v-chip v-for="item in store.suggestedProductNames" :key="item" @click="getProductByName(item)" elevation="3">
              {{ item }}
            </v-chip>
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
      <v-row v-if="lesemodus">
        <v-col cols="12">
          <v-card>
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
                <v-chip
                  v-for="tag in store.pricetag.entries"
                  ripple
                  class="mb-2 mx-1 d-flex"
                  elevation="3"
                  tile
                  size="small"
                  :key="tag.date"
                >
                  <div
                    class="d-inline-flex justify-space-between"
                    style="width: 100%"
                  >
                    <div style="width: 80px">
                      {{ tag.date.toDate().toLocaleDateString() }}
                    </div>
                    <div style="width: 50px">{{ tag.location }}</div>
                    <div style="width: 50px">{{ tag.amount }}g</div>
                    <div style="width: 50px; font-weight: bold">
                      {{ tag.price }} €
                    </div>
                    <div style="width: 90px">
                      {{ getKiloPreis(tag.amount, tag.price) }}
                    </div>
                  </div>
                </v-chip>
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
      <v-row v-if="store.creationMode">
        <v-col cols="12" md="12">
          Neues Produkt anlegen?
          <v-form ref="createform">
            <v-text-field
              label="Name"
              :rules="required"
              v-model="store.pricetag.productName"
            />
            <v-text-field label="Beschreibung" v-model="store.pricetag.description" />
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
            <v-text-field label="datum" v-model="store.formattedDate" />
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
        <v-col cols="12"> </v-col>
      </v-row>
      <v-row v-if="store.editmode">
        <v-col cols="12" md="12">
          <v-form ref="editform">
            <v-text-field
              label="Name"
              :rules="required"
              v-model="store.pricetag.productName"
            />
            <v-text-field label="Beschreibung" v-model="store.pricetag.description" />
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
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import PricetagEntry from "@/components/pricetag/PricetagEntry";
import { usePricetagStore } from "@/stores/PricetagStore";

const store = usePricetagStore();
const required = [(v) => !!v || "feld darf nicht leer sein"];
const combobox = ref<HTMLFormElement>();
const tagform = ref<HTMLFormElement>();
const addtagform = ref<HTMLFormElement>();
const editform = ref<HTMLFormElement>();
const createform = ref<HTMLFormElement>();
const prictagform = ref<HTMLFormElement>();
const toast = useToast();
let prictageEntryEdit = ref<PricetagEntry>(
  PricetagEntry.createEmptyPricetagEntry()
);
const entries = ref([]);
const lesemodus = computed(() => {
  return !store.editmode && !store.creationMode && store.pricetag;
});
function getKiloPreis(gramm: string, preis: string): string {
  if (gramm) {
    const p = parseFloat(preis.replace(",", "."));
    const g = parseFloat(gramm);
    return ((p / g) * 1000).toFixed(2) + " €/kg";
  } else return "- €/kg";
}

function clearResult() {
  store.clearResult();
  combobox.value.reset();
  editform.value.reset();
  prictagform.value.reset();
}

async function searchProduct() {
  const { valid } = await combobox.value.validate();
  if (valid) {
    await store.getProduct();
  }
}
async function getProductByName(item: string) {
  store.searchName = item;
  await store.getProduct();
}
async function addPricetagEntry() {
  const { valid } = await addtagform.value.validate();
  if (valid) {
    await store.addPricetagEntry();
    addtagform.value.reset();
    tagform.value.reset();
  }
}
async function saveNewProduct() {
  const { valid } = await createform.value.validate();
  if (valid) {
    await store.saveNewProduct();
  } else {
    console.log("error saveNewProduct", createform.value);
    console.log("prictageEntryEdit", prictageEntryEdit, entries);
    toast.error("felder dürfen nicht leer sein ");
  }
}
async function saveProduktUpdate() {
  const { valid: validname } = await editform.value.validate();
  if (validname) {
    await store.saveProductUpdate();
  } else {
    toast.error("felder dürfen nicht leer sein");
  }
}

//Lade initiativ alle Produkte
store.loadAllProducts();
</script>
<style scoped></style>
