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
import { COLLECTION_NAME, db } from "@/plugins/firebase";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
const IMAGE_FOLDER = "recipes";

export default class RecipeServiceApi {
  public static async deleteRecipe(recipeId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, recipeId)).then(() => {
      console.log("Document successfully deleted!", recipeId);
    });
  }
  public static async updateRecipe(recipe: Recipe): Promise<Recipe> {
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
      return docSnap.data();
    } else {
      console.log("Nichts gefunden mit id: ", recipeId);
    }
  }

  public static async getRecipes(): Promise<Array<Recipe>> {
    const c = await getDocs(
      collection(db, "recipes").withConverter(recipeConverter)
    );
    const a: Recipe[] = [];
    c.forEach((el) => a.push(el.data()));
    return a;
  }

  public static async createNewEditRecipe(recipe: Recipe): Promise<string> {
    if (!recipe.recipeName) {
      throw new Error("recipeName is missing");
    }
    const id = slugifyString(recipe.recipeName.substring(0, 128));
    recipe.id = id;
    console.log("id of recipe = ", id);
    try {
      const ref = setDoc(
        doc(db, COLLECTION_NAME, id).withConverter(recipeConverter),
        recipe
      )
        .then((refId) => {
          console.log("converted", ref);
          return refId;
        })
        .catch((e) => {
          console.log("doc ref error", e);
          return "error" + e;
        });
    } catch (e) {
      console.log("try error", e);
      return "error" + e;
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

  public static getAllRecipeImages(): Promise<string[]> {
    const storage = getStorage();
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
}
