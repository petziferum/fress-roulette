import Recipe, { recipeConverter, type CreatedBy, type Ingredient, type Description } from "@/components/Models/Recipe.class";
import { COLLECTION_NAME, db, user as firebaseUser } from "@/plugins/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

/**
 * Parses a JSON string and safely converts it into a Recipe instance.
 * The input is expected to match the Recipe.class.ts structure.
 * Throws a descriptive error on invalid input.
 */
export function convertRecipe(jsonString: string): Recipe {
  if (!jsonString || typeof jsonString !== "string") {
    throw new Error("Kein JSON-Text übergeben.");
  }

  let data: any;
  try {
    data = JSON.parse(jsonString);
  } catch (e: any) {
    throw new Error("Ungültiges JSON: " + (e?.message ?? e));
  }

  // Basic validation
  if (!data || typeof data !== "object") {
    throw new Error("JSON muss ein Objekt sein.");
  }

  // Normalize arrays/fields
  const ingredients: Ingredient[] = Array.isArray(data.ingredients)
    ? data.ingredients.map((i: any) => ({
        menge: (i?.menge ?? "").toString(),
        name: (i?.name ?? "").toString(),
      }))
    : [];

  const recipeDescription: Description[] = Array.isArray(data.recipeDescription)
    ? data.recipeDescription.map((d: any, idx: number) => ({
        nr: Number.isFinite(Number(d?.nr)) ? Number(d.nr) : idx + 1,
        text: (d?.text ?? "").toString(),
        img: (d?.img ?? "").toString(),
      }))
    : [];

  const createdBy: CreatedBy | undefined = data.createdBy
    ? { id: String(data.createdBy.id ?? ""), name: String(data.createdBy.name ?? "") }
    : undefined;

  const recipe = Recipe.createEmptyRecipe()
    .withRecipeName(String(data.recipeName ?? ""))
    .withCreatedBy(createdBy as any)
    .withTime(data.time ? new Date(data.time) : undefined as any)
    .withImageSrc(data.imageSrc ?? "")
    .withAdditionalImages(Array.isArray(data.additionalImages) ? data.additionalImages.map((x: any) => String(x)) : [])
    .withDescription(data.description ?? "")
    .withType(data.type ?? "")
    .withIngredients(ingredients)
    .withRecipeDescription(recipeDescription)
    .withActive(Boolean(data.active))
    .withTags(Array.isArray(data.tags) ? data.tags.map((x: any) => String(x)) : [])
    .withRating(
      data.rating == null || isNaN(Number(data.rating)) ? 0 : Number(data.rating)
    )
    .withDifficulty(
      data.difficulty == null || isNaN(Number(data.difficulty)) ? 0 : Number(data.difficulty)
    );

  if (!recipe.recipeName) {
    throw new Error("recipeName fehlt im JSON.");
  }

  return recipe;
}

/**
 * Completes and saves the recipe to Firestore 'recipes' collection.
 * - Adds createdBy/time if not present using current user store
 * - Uses the model's recipeConverter
 * Returns the new document id.
 */
export async function saveRecipeToFirestore(recipe: Recipe): Promise<string> {
  // If not set by JSON, enrich with current user/time
  const current = firebaseUser?.value;
  if (!recipe.createdBy && current) {
    recipe.createdBy = {
      id: current.uid,
      name: current.displayName ?? "",
    } as any;
  }
  if (!recipe.time) {
    recipe.time = new Date();
  }

  const ref = doc(collection(db, COLLECTION_NAME)).withConverter(recipeConverter);
  await setDoc(ref, recipe);
  return ref.id;
}
