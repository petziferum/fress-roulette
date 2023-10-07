import type Recipe from "@/components/Models/Recipe.class";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/plugins/firebase";
import { recipeConverter } from "@/components/Models/Recipe.class";
import { slugifyString } from "@/common/scripts";

const DB_COLLECTION = "test";

export default class RecipeServiceApi {
  public static async updateRecipe(recipe: Recipe): Promise<Recipe> {
    const recipeRef = doc(db, DB_COLLECTION, recipe.id!).withConverter(
      recipeConverter
    );
    return await setDoc(recipeRef, recipe).then(() => recipe);
  }

  public static async getSingleRecipe(
    recipeId: string
  ): Promise<Recipe | undefined> {
    const docRef = doc(db, DB_COLLECTION, recipeId).withConverter(
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
      collection(db, "test").withConverter(recipeConverter)
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
    try {
      const ref = doc(db, DB_COLLECTION, id).withConverter(recipeConverter);
      return await setDoc(ref, recipe).then((res) => {
        return ref.id;
      });
    } catch (e) {
      return "error";
    }
  }

  public static async saveNewRecipe(recipe: Recipe): Promise<string> {
    //const recipeDbObject = recipeConverter.toFirestore(recipe);
    try {
      const ref = doc(collection(db, DB_COLLECTION)).withConverter(
        recipeConverter
      );
      return await setDoc(ref, recipe).then(() => {
        return ref.id;
      });
    } catch (e) {
      return "error";
    }
  }
}
