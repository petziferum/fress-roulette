import { COLLECTION_NAME, db } from "@/plugins/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import type PricetagEntry from "@/components/pricetag/PricetagEntry";

export default class PricetagServiceApi {
  public static async saveNewPriceTag({
    productName,
    description,
    entries,
  }: {
    productName: string;
    description: string;
    entries: PricetagEntry[];
  }) {
    try {
      const ref = doc(db, "pricetags", productName);
      return await setDoc(ref, {
        productName,
        description,
        entries,
      }).then((response) => {
        console.log("Document written with ID: ", response);
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  public static async getProduct(productName: string): Promise<Object> {
    const docRef = doc(db, "pricetags", productName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Product geladen", docSnap.data());
      return docSnap.data();
    } else {
      console.log("Nichts gefunden mit id: ", productName);
    }
  }
}
