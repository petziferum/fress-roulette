import { db, fireBucket } from "@/plugins/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type Pricetag from "@/components/pricetag/Pricetag";
import { pricetagConverter } from "@/components/pricetag/Pricetag";
import { ref } from "vue";
import { getDownloadURL, ref as fireRef, uploadBytes } from "firebase/storage";

export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 10MB
const IMAGE_FOLDER = "pricetags/";
interface UploadStatus {
  type: string;
  message: string;
}

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
  public static async uploadPhoto(file: File): Promise<string> {
    const uploadStatus = ref<UploadStatus | null>(null);
    if (file.size > MAX_FILE_SIZE) {
      uploadStatus.value = { type: "error", message: "File too large!" };
      return;
    } else {
      const storageRef = fireRef(fireBucket, IMAGE_FOLDER + file.name);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log("Uploaded a blob or file!", downloadUrl);
        return downloadUrl;
      } catch (error) {
        console.log("Fehler: ", error);
      }
      uploadStatus.value = {
        type: "success",
        message: `File selected with size: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)} MB`,
      };
    }
  }
  public static async getProduct(productName: string): Promise<Pricetag | null> {
    const docRef = doc(db, "pricetags", productName).withConverter(pricetagConverter);
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
