<template>
  <v-container class="mt-12">
    <v-card>
      <v-card-title>Preisliste</v-card-title>
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
          <v-btn block tile color="blue" height="70%" @click="searchProduct"
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
              <v-btn
                color="#000000"
                append-icon="mdi-plus"
                text="Tag hinzufügen"
                class="my-4"
                v-show="!addTagMode"
                @click="addTagMode = true"
              />
              <template v-if="addTagMode">
                <v-form ref="addtagform">
                  <v-select
                    :items="marktItems"
                    label="Markt"
                    v-model="prictageEntryEdit.location"
                  />
                  <v-text-field
                    label="Menge in g"
                    v-model="prictageEntryEdit.amount"
                    suffix="g"
                  />
                  <v-text-field
                    label="Preis"
                    :rules="required"
                    v-model="prictageEntryEdit.price"
                  />
                  <v-btn
                    class="my-4"
                    color="error"
                    @click="addTagMode = false"
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
                  v-for="tag in entries"
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
                    <div style="width: 50px">
                      {{ tag.amount }}g
                    </div>
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
      </v-row>
      <v-row v-if="creationMode">
        <v-col cols="12" md="12">
          Neues Produkt anlegen?
          <v-form ref="createform">
            <v-text-field
              label="Name"
              :rules="required"
              v-model="productname"
            />
            <v-text-field label="Beschreibung" v-model="description" />
            <v-select
              :items="marktItems"
              label="Markt"
              v-model="prictageEntryEdit.location"
            />
            <v-text-field
              label="Menge in g"
              v-model="prictageEntryEdit.amount"
              suffix="g"
            />
            <v-text-field
              label="Preis"
              :rules="required"
              v-model="prictageEntryEdit.price"
            />
            <v-text-field label="datum" v-model="formattedDate" />
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
              @click="saveNewProduct"
              text="Speichern"
            />
          </v-form>
          {{ entries}}
        </v-col>
        <v-col cols="12"> </v-col>
      </v-row>
      <v-row v-if="editmode">
        <v-col cols="12" md="12">
          <v-form ref="editform">
            <v-text-field
              label="Name"
              :rules="required"
              v-model="productname"
            />
            <v-text-field label="Beschreibung" v-model="description" />
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
              @click="exitEdit"
              text="Abbrechen"
            />
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import PricetagServiceApi from "@/components/pricetag/PricetagService.api";
import { db } from "@/plugins/firebase";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useToast } from "vue-toastification";

const searchName = ref("");
const productname = ref("");
const price = ref("");
const date = ref(new Date(Date.now()));
const description = ref("");
const editmode = ref(false);
const addTagMode = ref(false);
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
const tagform = ref<HTMLFormElement>();
const addtagform = ref<HTMLFormElement>();
const editform = ref<HTMLFormElement>();
const createform = ref<HTMLFormElement>();
const prictagform = ref<HTMLFormElement>();
const toast = useToast();
let prictageEntryEdit = reactive({
  price: "",
  date: Timestamp.now(),
  amount: "",
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

function getKiloPreis(gramm: string, preis: string): string {
  const p = parseFloat(preis.replace(",", "."));
  const g = parseFloat(gramm);
  console.log("getKiloPreis", p, g);
  return (p / g) * 1000 + " €/kg";
}
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
  creationMode.value = false;
  prictageEntryEdit = {
    price: "",
    date: Timestamp.now(),
    amount: "",
    location: "",
  };
}
async function addPricetag() {
  const { valid: validname } = await editform.value.validate();
  const { valid: validtag } = await prictagform.value.validate();
  console.log("addPrictag valid: ", validname, validtag);
  if (validname && validtag) {
    console.log("speichere neuen Preis", productname.value, prictageEntryEdit);
    entries.value.push(prictageEntryEdit);
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
async function searchProduct() {
  const { valid } = await combobox.value.validate();
  if (valid) {
    await getProduct(searchName.value);
  }
}
async function getProduct(name: string): Promise<void> {
  entries.value = [];
  if (name) {
    console.log("fetch Product", name);
    PricetagServiceApi.getProduct(name)
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
      })
      .catch(() => {
        toast.info("Neues Produkt anlegen");
        editmode.value = false;
        creationMode.value = true;
        Object.assign(productname, searchName);
      });
  } else {
    toast.error("Kein Produktname angegeben");
  }
}
async function addPricetagEntry() {
  prictageEntryEdit.date = Timestamp.now();
  const { valid } = await addtagform.value.validate();
  if (valid) {
    entries.value.push(prictageEntryEdit);
    const product = {
      productName: productname.value,
      description: description.value,
      entries: entries.value,
    };
    PricetagServiceApi.saveProductUpdate(product).then(() => {
      toast.success("Eintrag hinzugefügt");
      addTagMode.value = false;
      getProduct(product.productName);
      addtagform.value.reset();
    });
    prictageEntryEdit = {
      price: "",
      date: Timestamp.now(),
      amount: "",
      location: "",
    };
    tagform.value.reset();
  }
}
async function saveNewProduct() {
  console.log("saveNewProduct", productname.value, entries.value);
  const { valid } = await createform.value.validate();
  entries.value.push(prictageEntryEdit);
  const product = {
    productName: productname.value,
    description: description.value,
    entries: entries.value,
  };
  if (valid) {
    PricetagServiceApi.saveNewPriceTag(product).then(() => {
      getProduct(productname.value);
      toast.success("Produkt " + productname.value + " gespeichert");
      exitEdit();
    });
  } else {
    toast.error("felder dürfen nicht leer sein");
  }
}
async function saveProduktUpdate() {
  const { valid: validname } = await editform.value.validate();
  console.log("saveProduktUpdate pricetagentry:", prictageEntryEdit);
  if (validname) {
    entries.value.push(prictageEntryEdit);
    PricetagServiceApi.saveProductUpdate({
      productName: productname.value,
      description: description.value,
      entries: entries.value,
    }).then(() => {
      getProduct(productname.value);
      toast.success("Produkt " + productname.value + " gespeichert");
      exitEdit();
    });
  } else {
    toast.error("felder dürfen nicht leer sein");
  }
}
</script>
<style scoped></style>
