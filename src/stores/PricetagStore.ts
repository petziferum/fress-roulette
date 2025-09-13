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
import PricetagServiceApi, {
  type UploadStatus,
} from "@/components/pricetag/PricetagService.api";
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
      readMode: true,
      editmode: false,
      addTagMode: false,
      editEntryMode: false,
      editEntryIndex: -1,
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
        "Asia-Shop",
        "IShop",
        "Penny",
        "Netto",
        "Kaufland",
        "Rischart",
        "McDonalds",
        "Hasis",
        "Traublinger",
        "Sonstiger",
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
      this.pricetag = null;
      this.readMode = true;
      this.editmode = false;
      this.creationMode = false;
      if (!this.searchName) {
        toast.info("Kein Suchbegriff eingegeben.");
        return;
      }
      this.suggestedProductNames = [];
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
      this.suggestedProductNames = Array.from(
        new Set(filteredProducts.map((product) => product.productName))
      );
    },
    clearResult() {
      this.pricetag = null;
      this.price = "";
      this.searchName = null;
      this.description = "";
      this.entries = [];
      this.editmode = false;
      this.creationMode = false;
      this.suggestedProductNames = [];
    },
    resetPricetagEntryEdit() {
      this.pricetagEntryEdit = PricetagEntry.createEmptyPricetagEntry();
    },
    exitEdit() {
      this.editmode = false;
      this.creationMode = false;
      this.editEntryMode = false;
      this.editEntryIndex = -1;
      this.resetPricetagEntryEdit();
    },
    startEditEntry(index: number) {
      const entry = this.pricetag.entries[index];
      this.pricetagEntryEdit = new PricetagEntry(
        entry.price,
        entry.date,
        entry.location,
        entry.amount
      );
      this.editEntryMode = true;
      this.editEntryIndex = index;
      this.addTagMode = false;
    },
    saveEditedEntry() {
      if (this.editEntryIndex >= 0 && this.editEntryMode) {
        try {
          // Create a new array with the updated entry
          const updatedEntries = [...this.pricetag.entries];
          updatedEntries[this.editEntryIndex] = {
            ...this.pricetagEntryEdit,
            date: this.pricetag.entries[this.editEntryIndex].date // Keep the original date
          };
          
          this.pricetag.entries = updatedEntries;
          
          // Save the updated product
          this.saveProductUpdate();
          toast.success("Eintrag aktualisiert");
          this.editEntryMode = false;
          this.editEntryIndex = -1;
          this.resetPricetagEntryEdit();
        } catch (error) {
          toast.error("Eintrag konnte nicht aktualisiert werden");
        }
      }
    },
    cancelEditEntry() {
      this.editEntryMode = false;
      this.editEntryIndex = -1;
      this.resetPricetagEntryEdit();
    },
    async getProduct(): Promise<void> {
      this.entries = [];
      if (this.searchName) {
        console.log("searchName", this.searchName);
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
      await PricetagServiceApi.saveNewPriceTag(this.pricetag);
      toast.success("Produkt " + this.pricetag.productName + " gespeichert");
      this.exitEdit();
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
    getAllProducts: (state) => {
      return [...state.allProducts].sort((a, b) => 
        a.productName.localeCompare(b.productName)
      );
    },
  },
});
