import { COLLECTION_NAME, db } from "@/plugins/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import Recipe, { recipeConverter } from "@/components/Models/Recipe.class";

export default class PricetagServiceApi {
  public static async saveNewPriceTag({
    productName,
    description,
    price,
    date,
    markt,
  }: {
    productName: string;
    description: string;
    price: string;
    date: Date;
    markt: string;
  }) {
    try {
      const ref = doc(db, "pricetags", productName);
      return await setDoc(ref, {
        productName,
        description,
        price,
        date,
        markt,
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
