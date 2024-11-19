<template>
  <v-container class="mt-12">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Preisliste</v-card-title>
          <v-card-subtitle>Preise checken</v-card-subtitle>
          <v-row>
            <v-col cols="12" md="12">
              <v-form ref="tagform">
                <v-combobox
                  label="Produktname"
                  v-model="productname"
                  :items="suggestedProductNames"
                  @input="findProductname"
                  clearable
                  @update:modelValue="selectProductname"
                />
                <v-text-field label="Beschreibung" v-model="description" />
                <v-btn
                  v-if="!editmode"
                  block
                  variant="outlined"
                  color="green"
                  @click="enterEditMode"
                  text="Neuen Preis hinzufügen"
                />
                <template v-if="editmode">
                  <v-select
                    :items="marktItems"
                    label="Markt"
                    v-model="pricetagEntry.location"
                  />
                  <v-text-field
                    label="Preis"
                    type="number"
                    v-model="pricetagEntry.price"
                  />
                  <v-date-picker label="datum" v-model="pricetagEntry.date" />
                </template>
              </v-form>
              <v-btn
                v-if="editmode"
                block
                color="red"
                variant="outlined"
                class="mb-3"
                @click="editmode = false"
                text="Abbrechen"
              />
              <v-btn
                v-if="editmode"
                block
                variant="outlined"
                @click="addPricetag"
                text="Speichern"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="d-flex flex-column">
                <v-chip
                  v-for="tag in entries"
                  ripple
                  class="mb-2 mx-2 d-flex"
                  elevation="3"
                  size="small"
                  :key="tag.date"
                >
                  <div
                    class="d-inline-flex justify-space-between"
                    style="width: 100%"
                  >
                    <div style="width: 100px">
                      {{ tag.date.toDate().toLocaleDateString() }}
                    </div>
                    <div style="width: 100px">{{ tag.location }}</div>
                    <div style="width: 100px; font-weight: bold">
                      {{ tag.price }} €
                    </div>
                  </div>
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PricetagServiceApi from "@/components/pricetag/PricetagService.api";
import { db } from "@/plugins/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const productname = ref("");
const price = ref("");
const date = ref(new Date(Date.now()));
const description = ref("");
const editmode = ref(false);
const marktItems = ref([
  "Aldi",
  "Lidl",
  "Rewe",
  "Edeka",
  "Dm",
  "Rossmann",
  "Müller",
  "H&M",
  "Asia-Markt Riemarcaden",
  "IShop",
  "Penny",
  "Netto",
  "Kaufland",
  "Rischart",
  "McDonalds",
  "Hasis",
  "Traublinger",
]);
const selectedMarkt = ref("");
const suggestedProductNames = ref<string[]>([]);
const pricetagEntry = reactive({
  price: "",
  date: new Date(),
  location: "",
});
const entries = ref([]);

const formattedDate = computed(() => {
  return date.value.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

async function findProductname() {
  if (!productname.value) return;
  // Firebase query to find matching product names
  const productsRef = collection(db, "pricetags");
  //const q = query(productsRef, where("productName", ">=", productname.value.toLowerCase()), where("productName", "<=", productname.value.toLowerCase() + "\uf8ff"));
  const querySnapshot = await getDocs(productsRef);
  suggestedProductNames.value = querySnapshot.docs
    .map((doc) => doc.data().productName)
    .filter((name) =>
      name.toLowerCase().startsWith(productname.value.toLowerCase())
    );
}

function enterEditMode() {
  editmode.value = true;
}

function selectProductname() {
  console.log("selectProductname", productname.value);
  getProduct();
}

function addPricetag() {
  console.log(productname.value, price.value, date.value, selectedMarkt.value);
  entries.value.push(pricetagEntry);
  PricetagServiceApi.saveNewPriceTag({
    productName: productname.value,
    description: description.value,
    entries: entries.value,
  }).then(() => {
    getProduct();
    editmode.value = false;
    pricetagEntry.price = "";
    pricetagEntry.location = "";
    pricetagEntry.date = new Date();
  });
}
function getProduct() {
  entries.value = [];
  console.log("fetch Product", productname.value);
  PricetagServiceApi.getProduct(productname.value).then((result) => {
    price.value = result.price;
    if (result.entries) {
      entries.value = result.entries;
    } else {
      const newEntry = {
        date: result.date,
        location: result.markt,
        price: result.price,
      };
      entries.value.push(newEntry);
    }
    description.value = result.description;
    selectedMarkt.value = result.markt;
  });
}
</script>
<style scoped></style>
