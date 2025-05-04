import Pricetag from "@/components/pricetag/Pricetag";
import PricetagEntry from "@/components/pricetag/PricetagEntry";
import { defineStore } from "pinia";
import {
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/plugins/firebase";
import PricetagServiceApi, { type UploadStatus } from "@/components/pricetag/PricetagService.api";
import { useToast } from "vue-toastification";
import { ref } from "vue";

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
      allProducts: [] as Pricetag[],
      uploadStatus: {} as UploadStatus,
      pricetagImage: null,
      loading: false,
    };
  },
  actions: {
    async uploadImage(file: File) {
      this.loading = true;
      PricetagServiceApi.uploadPhoto(file)
        .then((res) => {
          this.pricetag.imageUrl = res;
        })
        .finally(() => (this.loading = false));
    },
    async loadAllProducts() {
      this.allProducts = [];
      const productsRef = collection(db, "pricetags");
      const querySnapshot = await getDocs(productsRef);
      querySnapshot.forEach((doc) => {
        const product = doc.data() as Pricetag;
        if (product.searchKeys.length == 0) {
          product.searchKeys = Pricetag.generateSearchKeys(
            product.productName,
            product.description
          );
        }
        this.allProducts.push(product);
      });
    },
    async findProductname() {
      if (!this.searchName) {
        toast.info("Kein Suchbegriff eingegeben.");
        return;
      }
      const searchTerm = this.searchName.toLowerCase();
      const filteredProducts = this.allProducts.filter((product) => {
        if (Array.isArray(product.searchKeys)) {
          return product.searchKeys.some((key) => key.includes(searchTerm));
        }
        if (product.productName) {
          return product.productName.toLowerCase().includes(searchTerm);
        }
        return false;
      });
      this.suggestedProductNames = filteredProducts.map(
        (product) => product.productName
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
        PricetagServiceApi.getProduct(this.searchName)
          .then((result: Pricetag | any) => {
            this.pricetag = result as Pricetag;
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
      try {
        const newEntry = {
          ...this.pricetagEntryEdit,
          date: Timestamp.now(),
        };

        this.pricetag.entries = [...(this.pricetag.entries || []), newEntry];

        await this.saveProductUpdate();
        toast.success("Eintrag hinzugefügt");
        this.addTagMode = false;
        this.resetPricetagEntryEdit();
      } catch (error) {
        toast.error("Eintrag konnte nicht hinzugefügt werden");
      }
    },
    async saveProductUpdate() {
      this.pricetag.withSearchKeys(
        Pricetag.generateSearchKeys(
          this.pricetag.productName,
          this.pricetag.description
        )
      );
      PricetagServiceApi.saveProductUpdate(this.pricetag).then(() => {
        this.getProduct();
        toast.success("Produkt " + this.pricetag.productName + " gespeichert");
        this.exitEdit();
      });
    },
    async saveNewProduct() {
      this.pricetag.withEntries([this.pricetagEntryEdit]);
      this.pricetag.withSearchKeys(
        Pricetag.generateSearchKeys(
          this.pricetag.productName,
          this.pricetag.description
        )
      );
      PricetagServiceApi.saveNewPriceTag(this.pricetag).then(() => {
        toast.success("Produkt " + this.pricetag.productName + " gespeichert");
        this.exitEdit();
      });
    },
    async generateAndSaveSearchKeys(): Promise<void> {
      try {
        const productsRef = collection(db, "pricetags"); // Ersetze "pricetags" durch den Namen deiner Sammlung
        const querySnapshot = await getDocs(productsRef);

        // Alle Produkte durchlaufen und `searchKeys` generieren
        querySnapshot.forEach(async (document) => {
          const product = document.data();
          const productId = document.id;

          // Generiere `searchKeys` aus `productName` und `description`
          const searchKeys = new Set();

          if (product.productName) {
            product.productName
              .toLowerCase()
              .split(/\s+/) // Zerlege in einzelne Wörter
              .forEach((word) => searchKeys.add(word));
          }

          if (product.description) {
            product.description
              .toLowerCase()
              .split(/\s+/) // Zerlege in einzelne Wörter
              .forEach((word) => searchKeys.add(word));
          }

          // Suche aktualisieren
          const searchKeysArray = Array.from(searchKeys);

          // Produkt in Firebase aktualisieren
          const productDocRef = doc(productsRef, productId);
          await updateDoc(productDocRef, { searchKeys: searchKeysArray });

          console.log(
            `Produkt ${productId} aktualisiert mit searchKeys:`,
            searchKeysArray
          );
        });

        console.log("Alle Produkte wurden erfolgreich aktualisiert.");
      } catch (error) {
        console.error(
          "Fehler beim Generieren und Speichern von searchKeys:",
          error
        );
      }
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
    getSuggestedProductNames: (state) => {
      return state.suggestedProductNames;
    },
  },
});
