import Pricetag from "@/components/pricetag/Pricetag";
import PricetagEntry from "@/components/pricetag/PricetagEntry";
import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";
import PricetagServiceApi from "@/components/pricetag/PricetagService.api";
import { useToast } from "vue-toastification";

const toast = useToast();

export const usePricetagStore = defineStore("pricetagStore", {
  state: () => {
    return {
      searchName: "",
      pricetag: null as Pricetag | null,
      price: "",
      date: new Date(Date.now()),
      description: "",
      editmode: false,
      addTagMode: false,
      creationMode: false,
      marktItems: [
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
      ],
      selectedMarkt: "",
      suggestedProductNames: [] as string[],
      pricetagEntryEdit: PricetagEntry.createEmptyPricetagEntry(),
      entries: [],
    };
  },
  actions: {
    async findProductname() {
      console.log("search", this.searchName);
      if (!this.searchName) return;
      const productsRef = collection(db, "pricetags");
      const q = query(
        productsRef,
        where("productName", ">=", this.searchName.toLowerCase()),
        where("productName", "<=", this.searchName.toLowerCase() + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      this.suggestedProductNames = querySnapshot.docs.map(
        (doc) => doc.data().productName
      );
    },
    clearResult() {
      this.price = "";
      this.description = "";
      this.entries = [];
      this.editmode = false;
      this.creationMode = false;
    },
    resetPricetagEntryEdit() {
      this.pricetagEntryEdit = PricetagEntry.createEmptyPricetagEntry();
    },
    exitEdit() {
      this.editmode = false;
      this.creationMode = false;
      this.creationMode = false;
      this.resetPricetagEntryEdit();
    },
    async getProduct(): Promise<void> {
      this.entries = [];
      if (this.searchName) {
        console.log("fetch Product", this.searchName);
        PricetagServiceApi.getProduct(this.searchName)
          .then((result: Pricetag | any) => {
            this.pricetag = result;
            this.selectedMarkt = result.markt;
          })
          .catch(() => {
            toast.info("Neues Produkt anlegen");
            this.editmode = false;
            this.creationMode = true;
            this.pricetag = Pricetag.createEmptyPricetag().withProductName(
              this.searchName
            );
          });
      } else {
        toast.error("Kein Produktname angegeben");
      }
    },
    async addPricetagEntry() {
      this.pricetagEntryEdit.date = Timestamp.now();
      this.pricetag.entries.push(this.pricetagEntryEdit);
      await this.saveProductUpdate().then(() => {
        toast.success("Eintrag hinzugefügt");
        this.addTagMode = false;
      });
      this.resetPricetagEntryEdit();
    },
    async saveProductUpdate() {
      PricetagServiceApi.saveProductUpdate(this.pricetag).then(() => {
        this.getProduct();
        toast.success("Produkt " + this.pricetag.productName + " gespeichert");
        this.exitEdit();
      });
    },
    async saveNewProduct() {
      this.pricetag.withEntries([this.pricetagEntryEdit]);
      PricetagServiceApi.saveNewPriceTag(this.pricetag).then(() => {
        toast.success("Produkt " + this.pricetag.productName + " gespeichert");
        this.exitEdit();
      });
    },
  },
  getters: {
    formattedDate: (state) => {
      return state.date.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    lesemodus: (state) => {
      return !state.editmode && !state.creationMode && state.pricetag;
    },
  },
});
