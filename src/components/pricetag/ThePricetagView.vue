<template>
  <v-container class="mt-12">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Preisliste</v-card-title>
          <v-card-subtitle
            >searchname:{{ searchName }} productname:{{
              productname
            }}</v-card-subtitle
          >
          <v-row no-gutters>
            <v-col cols="9">
              <v-form ref="combobox">
                <v-combobox
                  label="Produktname"
                  v-model="searchName"
                  :items="suggestedProductNames"
                  @input="findProductname"
                  clearable
                  @click:clear="clearResult"
                  :rules="required"
                />
              </v-form>
            </v-col>
            <v-col cols="3">
              <v-btn block tile color="blue" height="70%" @click="getProduct"
                >Suchen</v-btn
              >
            </v-col>
          </v-row>
          <v-row v-if="lesemodus">
            <v-col cols="12">
              <v-card>
                <v-card-title
                  >{{ productname
                  }}<v-btn
                    position="rigth"
                    flat
                    icon="mdi-pencil"
                    size="small"
                    @click="editmode = true"
                /></v-card-title>
                <v-card-text>{{ description }}</v-card-text>
                <v-card-text>
                  Preise
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
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="creationMode">
            <v-col cols="12" md="12">
              Neues Produkt anlegen?
              <v-form ref="tagform">
                <v-text-field label="Name" v-model="productname" />
                <v-text-field label="Beschreibung" v-model="description" />
                <v-btn
                  block
                  color="red"
                  variant="outlined"
                  class="mb-3"
                  @click="creationMode = false"
                  text="Abbrechen"
                />
                <v-btn
                  block
                  variant="outlined"
                  @click="saveProduktUpdate"
                  text="Speichern"
                />
              </v-form>
            </v-col>
          </v-row>
          <v-row v-if="editmode">
            <v-col cols="12" md="12">
              <v-form ref="editform">
                <v-text-field label="Name" v-model="productname" />
                <v-text-field label="Beschreibung" v-model="description" />
                <v-btn
                  block
                  variant="outlined"
                  class="mb-3"
                  @click="saveProduktUpdate"
                  text="Produkt speichern"
                />
              </v-form>
              <v-form ref="prictagform">
                <v-select
                  :items="marktItems"
                  label="Markt"
                  v-model="pricetagEntry.location"
                />
                <v-text-field
                  label="Preis"
                  :rules="required"
                  v-model="pricetagEntry.price"
                />
                <v-text-field label="datum" v-model="formattedDate" />
                <v-btn
                  block
                  variant="outlined"
                  class="mb-3"
                  color="green"
                  @click="addPricetag"
                  text="Neuen Preis hinzufügen"
                />
                <v-btn
                  block
                  color="red"
                  variant="outlined"
                  class="mb-3"
                  @click="exitEdit"
                  text="Abbrechen"
                />
              </v-form>
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
import { useToast } from "vue-toastification";

const searchName = ref("");
const productname = ref("");
const price = ref("");
const date = ref(new Date(Date.now()));
const description = ref("");
const editmode = ref(false);
const creationMode = ref(false);
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
const required = [(v) => !!v || "feld darf nicht leer sein"];
const combobox = ref<HTMLFormElement>();
const editform = ref<HTMLFormElement>();
const prictagform = ref<HTMLFormElement>();
const toast = useToast();
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
const lesemodus = computed(() => {
  return !editmode.value && !creationMode.value && productname.value;
});
async function findProductname() {
  if (!searchName.value) return;
  const productsRef = collection(db, "pricetags");
  const q = query(
    productsRef,
    where("productName", ">=", productname.value.toLowerCase()),
    where("productName", "<=", productname.value.toLowerCase() + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);

  suggestedProductNames.value = querySnapshot.docs.map(
    (doc) => doc.data().productName
  );
  /*.filter((name) =>
      name.toLowerCase().startsWith(searchName.value.toLowerCase())
    );*/
}

function clearResult() {
  productname.value = "";
  price.value = "";
  description.value = "";
  entries.value = [];
  editmode.value = false;
  creationMode.value = false;
  combobox.value.reset();
  editform.value.reset();
  prictagform.value.reset();
}
function exitEdit() {
  editmode.value = false;
  creationMode.value = false;
  prictagform.value.reset();
}
async function addPricetag() {
  const { valid: validname } = await editform.value.validate();
  const { valid: validtag } = await prictagform.value.validate();
  console.log("addPrictag valid: ", validname, validtag);
  if (validname && validtag) {
    console.log("speichere neuen Preis", productname.value, pricetagEntry);
    entries.value.push(pricetagEntry);
    PricetagServiceApi.saveNewPriceTag({
      productName: productname.value,
      description: description.value,
      entries: entries.value,
    }).then(async () => {
      entries.value = [];
      await PricetagServiceApi.getProduct(productname.value).then((result) => {
        price.value = result.price;
        productname.value = result.productName;
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
        combobox.value.reset();
      });
      exitEdit();
    });
  }
}
async function getProduct(): Promise<void> {
  entries.value = [];
  const { valid } = await combobox.value.validate();
  console.log("getProduct valid", valid);
  if (valid) {
    console.log("fetch Product", searchName.value);
    PricetagServiceApi.getProduct(searchName.value)
      .then((result) => {
        price.value = result.price;
        productname.value = result.productName;
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
        combobox.value.reset();
      })
      .catch(() => {
        editmode.value = false;
        creationMode.value = true;
        Object.assign(productname, searchName);
        searchName.value = "";
      });
  } else {
    console.log("invalid");
  }
}

function saveProduktUpdate() {
  console.log("saveProduktUpdate:", productname.value, description.value);
  PricetagServiceApi.saveProductUpdate({
    productName: productname.value,
    description: description.value,
    entries: entries.value,
  }).then(() => {
    editmode.value = false;
    creationMode.value = false;
    toast.success("Produkt " + productname.value + " gespeichert");
  });
}
</script>
<style scoped></style>
