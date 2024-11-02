<template>
  <v-container class="mt-12">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Preisliste</v-card-title>
          <v-card-subtitle>Preise checken</v-card-subtitle>
          <v-row>
            <v-col cols="12">
              <v-select :items="marktItems" label="Markt" />
            </v-col>
            <v-col cols="12" md="6">
              <v-form ref="tagform">
                <v-combobox
                  label="Produktname"
                  v-model="productname"
                  :items="suggestedProductNames"
                  @input="findProductname"
                  @update:focused="selectProductname"
                />
                <v-text-field label="Beschreibung" v-model="description" />
                <v-text-field label="Preis" type="number" v-model="price" />
                <v-text-field label="datum" v-model="date" />
              </v-form>
            </v-col>
            <v-col>
              <v-btn block variant="outlined" @click="addPricetag">Neuen Preis hinzufügen</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">

import { ref } from "vue";
import PricetagServiceApi from "@/components/pricetag/PricetagService.api";
import { db } from "@/plugins/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const productname = ref("");
const price = ref("");
const date = ref(new Date(Date.now()));
const description = ref("");
const marktItems = ref(["Aldi", "Lidl", "Rewe", "Edeka"]);
const selectedMarkt = ref("");
const suggestedProductNames = ref<string[]>([]);

async function findProductname() {
  if (!productname.value) return;
  // Firebase query to find matching product names
  const productsRef = collection(db, "pricetags");
  //const q = query(productsRef, where("productName", ">=", productname.value.toLowerCase()), where("productName", "<=", productname.value.toLowerCase() + "\uf8ff"));
  const querySnapshot = await getDocs(productsRef);
  suggestedProductNames.value = querySnapshot.docs
    .map(doc => doc.data().productName)
    .filter(name => name.toLowerCase().startsWith(productname.value.toLowerCase()));
}

function selectProductname() {
  console.log("selectProductname", productname.value);
  getProduct();
}

function addPricetag() {
  console.log(productname.value, price.value, date.value, selectedMarkt.value);
  PricetagServiceApi.saveNewPriceTag({
    productName: productname.value,
    description: description.value,
    price: price.value,
    date: date.value,
    markt: selectedMarkt.value,
  }).then((result) => {
    console.log("result", result);
  });
}
function getProduct() {
  console.log("fetch Product", productname.value);
  PricetagServiceApi.getProduct(productname.value).then((result) => {
    console.log("result", result);
    price.value=result.price;
  });
}
</script>
<style scoped></style>
