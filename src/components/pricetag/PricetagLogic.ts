import { computed, ref } from "vue";
import { useToast } from "vue-toastification";
import { usePricetagStore } from "@/stores/PricetagStore";
import PricetagEntry from "@/components/pricetag/PricetagEntry";

export function usePricetagLogic() {
  const store = usePricetagStore();
  const toast = useToast();

  const required = [(v: any) => !!v || "feld darf nicht leer sein"];
  const combobox = ref<HTMLFormElement>();
  const tagform = ref<HTMLFormElement>();
  const addtagform = ref<HTMLFormElement>();
  const editform = ref<HTMLFormElement>();
  const createform = ref<HTMLFormElement>();
  const prictagform = ref<HTMLFormElement>();
  const imageOverlay = ref(null);

  const prictageEntryEdit = ref<PricetagEntry>(
    PricetagEntry.createEmptyPricetagEntry()
  );
  const entries = ref([]);
  const lesemodus = computed(() => {
    return !store.editmode && !store.creationMode && store.pricetag;
  });

  function openImageOverlay() {
    imageOverlay.value?.open();
  }

  function getKiloPreis(gramm: string, preis: string): string {
    if (gramm) {
      const p = parseFloat(preis.replace(",", "."));
      const g = parseFloat(gramm);
      return ((p / g) * 1000).toFixed(2);
    } else return "-";
  }

  function clearResult() {
    store.clearResult();
    combobox.value?.reset();
    editform.value?.reset();
    prictagform.value?.reset();
  }

  async function searchProduct() {
    const result = await combobox.value?.validate?.();
    console.log("result: ", result);
    if (result?.valid) {
      await store.getProduct();
    } else {
      console.warn("Formular ungültig oder nicht initialisiert.");
    }
  }

  async function getProductByName(item: string) {
    store.searchName = item;
    await store.getProduct();
  }

  async function addPricetagEntry() {
    const { valid } = await addtagform.value?.validate();
    if (valid) {
      await store.addPricetagEntry();
      addtagform.value?.reset();
      tagform.value?.reset();
    }
  }

  async function saveNewProduct() {
    const { valid } = await createform.value?.validate();
    if (valid) {
      await store.saveNewProduct();
    } else {
      toast.error("felder dürfen nicht leer sein ");
    }
  }

  async function saveProduktUpdate() {
    const { valid: validname } = await editform.value?.validate();
    if (validname) {
      await store.saveProductUpdate();
    } else {
      toast.error("felder dürfen nicht leer sein");
    }
  }

  // Direkt initialisieren
  store.loadAllProducts();

  return {
    store,
    toast,
    required,
    combobox,
    tagform,
    addtagform,
    editform,
    createform,
    prictagform,
    imageOverlay,
    prictageEntryEdit,
    entries,
    lesemodus,
    openImageOverlay,
    getKiloPreis,
    clearResult,
    searchProduct,
    getProductByName,
    addPricetagEntry,
    saveNewProduct,
    saveProduktUpdate,
  };
}
