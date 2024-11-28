import { computed, ref } from "vue";
import type Pricetag from "@/components/pricetag/Pricetag";
import { useToast } from "vue-toastification";
import PricetagEntry from "@/components/pricetag/PricetagEntry";
import { defineStore } from "pinia";

export const usePricetagStore = defineStore("pricetagStore", {
  state: () => {
    return {
      searchName: "",
      pricetag: null as Pricetag | null,
      productname: "",
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
      prictageEntryEdit: PricetagEntry.createEmptyPricetagEntry(),
      entries: [],
    };
  },
});
