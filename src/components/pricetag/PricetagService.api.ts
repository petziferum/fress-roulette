import { COLLECTION_NAME, db } from "@/plugins/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import type PricetagEntry from "@/components/pricetag/PricetagEntry";
import type Pricetag from "@/components/pricetag/Pricetag";
import { pricetagConverter } from "@/components/pricetag/Pricetag";

export default class PricetagServiceApi {
  public static async saveNewPriceTag(pricetag: Pricetag): Promise<void> {
    try {
      const ref = doc(db, "pricetags", pricetag.productName).withConverter(
        pricetagConverter
      );
      return await setDoc(ref, pricetag).then(() => {
        console.log("Pricetag gespeichert");
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
  public static async getProduct(productName: string): Promise<Pricetag | null> {
    const docRef = doc(db, "pricetags", productName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Product geladen", docSnap.data());
      return docSnap.data() as Pricetag;
    } else {
      console.log("Nichts gefunden mit id: ", productName);
      return null;
    }
  }
  public static saveProductUpdate(product: Pricetag): Promise<string> {
    const ref = doc(db, "pricetags", product.productName).withConverter(pricetagConverter);
    return setDoc(ref, product).then(() => {
      return "Document successfully written!";
    });
  }
}
