import type Recipe from "@/components/Models/Recipe.class";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { recipeConverter } from "@/components/Models/Recipe.class";
import { slugifyString } from "@/common/scripts";
import { COLLECTION_NAME, db, fireBucket } from "@/plugins/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  ref as fireRef,
  uploadBytes,
} from "firebase/storage";
import router from "@/router";

const IMAGE_FOLDER = "recipes";

export default class RecipeServiceApi {
  public static async deleteRecipe(recipeId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, recipeId)).then(() => {
      console.log("Document successfully deleted!", recipeId);
    });
  }
  public static async updateRecipe(recipe: Recipe): Promise<Recipe> {
    console.log("update Recipe", recipe);
    const recipeRef = doc(db, COLLECTION_NAME, recipe.id!).withConverter(
      recipeConverter
    );
    return await setDoc(recipeRef, recipe).then(() => recipe);
  }
  public static async getSingleRecipe(
    recipeId: string
  ): Promise<Recipe | undefined> {
    const docRef = doc(db, COLLECTION_NAME, recipeId).withConverter(
      recipeConverter
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("rezept geladen", docSnap.data());
      return docSnap.data();
    } else {
      console.log("Nichts gefunden mit id: ", recipeId);
    }
  }
  /*
  public static async loadImagesFromFirebase() {
    const storage = getStorage();
    const imagesRef = storageRef(storage, `recipes/${id.value}`);

    // Load all images
    try {
      const imageList = await listAll(imagesRef);
      const imageUrls = await Promise.all(
        imageList.items.map((item) => getDownloadURL(item))
      );
      recipe.value.imageSrc = imageUrls[0]; // First image as title image
      recipe.value.additionalImages = imageUrls.slice(1); // Remaining as additional images
    } catch (error) {
      console.error("Error loading images from Firebase:", error);
    }
  }*/
  public static async getRecipes(): Promise<Array<Recipe>> {
    const c = await getDocs(
      collection(db, "recipes").withConverter(recipeConverter)
    );
    const a: Recipe[] = [];
    c.forEach((el) => a.push(el.data()));
    return a;
  }
  public static async createNewEditRecipe(recipe: Recipe): Promise<void> {
    if (!recipe.recipeName) {
      throw new Error("recipeName is missing");
    }
    const id = slugifyString(recipe.recipeName.substring(0, 128));
    recipe.id = id;
    console.log("srecipeServiceApi recipe = ", recipe);
    try {
      const ref = doc(db, COLLECTION_NAME, id).withConverter(recipeConverter);
      await setDoc(ref, recipe)
        .then(() => {
          console.log("weiterleiten nach /recipe/edit/" + id);
          router.push("/recipe/edit/" + id);
        })
        .catch((e) => {
          console.log("doc ref error", e);
          return "error" + e;
        });
    } catch (e) {
      console.log("try error", e);
    }
  }
  public static async saveNewRecipe(recipe: Recipe): Promise<string> {
    //const recipeDbObject = recipeConverter.toFirestore(recipe);
    try {
      const ref = doc(collection(db, COLLECTION_NAME)).withConverter(
        recipeConverter
      );
      return await setDoc(ref, recipe).then(() => {
        return ref.id;
      });
    } catch (e) {
      return "error";
    }
  }
  public static async getRecipeTags(): Promise<string[]> {
    const ref = doc(db, "tags", "allTags");
    const document = await getDoc(ref);
    return document.data().tags as string[];
  }
  public static async getAllRecipeImages(): Promise<string[]> {
    const storage = fireBucket;
    const recipeRef = ref(storage, IMAGE_FOLDER);
    return listAll(recipeRef)
      .then((res) => {
        const urlPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
        return Promise.all(urlPromises);
      })
      .catch((error) => {
        console.log("error", error);
        return []; // Return an empty array in case of error
      });
  }
  public static async uploadNewRecipeImage(file: any): Promise<string> {
    const storage = fireBucket;
    const folder = IMAGE_FOLDER + "/";
    const storageRef = fireRef(storage, folder + file.name);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log("Uploaded a blob or file!", downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.log("Fehler: ", error);
    }
  }
}
