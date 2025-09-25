import type { Difficulty } from "@/components/Models/Difficulty";
import { useUserStore } from "@/stores/useUserStore";

export interface Description {
  nr: number;
  text: string;
  img: string;
}

export interface Ingredient {
  menge: string;
  name: string;
}

export interface Meta {
  changed: Date;
  changedBy: CreatedBy;
}

export interface CreatedBy {
  id: string;
  name: string;
}

export default class Recipe {
  public id: string;
  public createdBy?: CreatedBy;
  public time?: Date;
  public imageSrc?: string;
  public additionalImages?: string[];
  public description?: string;
  public recipeName: string = "";
  public type?: string;
  public ingredients?: Ingredient[];
  public recipeDescription: Description[] = [];
  public active?: boolean;
  public tags?: string[];
  public rating?: number = 3.8;
  public difficulty?: number = 1;
  public meta?: Meta;

  constructor(
    id: string,
    createdBy?: CreatedBy,
    time?: Date,
    imageSrc?: string,
    additionalImages?: string[],
    description?: string,
    recipeName: string = "",
    type?: string,
    ingredients?: Ingredient[],
    recipeDescription: Description[] = [],
    active?: boolean,
    tags?: string[],
    rating?: number,
    difficulty?: number
  ) {
    this.id = id;
    this.createdBy = createdBy;
    this.recipeName = recipeName;
    this.time = time;
    this.imageSrc = imageSrc;
    this.additionalImages = additionalImages;
    this.description = description;
    this.type = type;
    this.ingredients = ingredients;
    this.recipeDescription = recipeDescription;
    this.active = active;
    this.tags = tags;
    this.rating = rating;
    this.difficulty = difficulty;
  }

  withRating(value: number): Recipe {
    this.rating = value;
    return this;
  }

  withId(value: string): Recipe {
    this.id = value;
    return this;
  }

  withTags(value: string[]): Recipe {
    this.tags = value ?? [];
    return this;
  }

  withRecipeName(value: string): Recipe {
    this.recipeName = value ?? "";
    return this;
  }

  withCreatedBy(value: CreatedBy): Recipe {
    this.createdBy = value ?? null;
    return this;
  }

  withTime(value: Date): Recipe {
    this.time = value;
    return this;
  }

  withImageSrc(value: string): Recipe {
    this.imageSrc = value ?? "";
    return this;
  }

  withAdditionalImages(value: string[]): Recipe {
    this.additionalImages = value ?? [];
    return this;
  }

  withDescription(value: string): Recipe {
    this.description = value ?? "";
    return this;
  }

  withType(value: string): Recipe {
    this.type = value ?? "";
    return this;
  }
  withIngredients(value: Ingredient[]): Recipe {
    this.ingredients = value ?? [];
    return this;
  }

  withRecipeDescription(value: Description[]): Recipe {
    this.recipeDescription = value ?? [];
    return this;
  }

  withActive(value: boolean): Recipe {
    this.active = value;
    return this;
  }

  withMeta(value: Meta): Recipe {
    this.meta = value;
    return this;
  }

  withDifficulty(value: number): Recipe {
    this.difficulty = value;
    return this;
  }

  setActive(): void {
    this.active = true;
  }

  addIngredient(value: Ingredient): Recipe {
    this.ingredients
      ? this.ingredients.push(value)
      : (this.ingredients = [value]);
    return this;
  }

  addStep(value: Description): Recipe {
    this.recipeDescription
      ? this.recipeDescription.push(value)
      : (this.recipeDescription = [value]);
    return this;
  }

  public static createEmptyRecipe(): Recipe {
    return new Recipe("0");
  }
}

export const recipeConverter = {
  toFirestore: (recipe: Recipe) => {
    console.log("toFirestore converter gestartet", recipe);
    return {
      recipeName: recipe.recipeName,
      createdBy: recipe.createdBy,
      time: recipe.time,
      active: recipe.active,
      ingredients: recipe.ingredients ? recipe.ingredients : [],
      description: recipe.description,
      recipeDescription: recipe.recipeDescription
        ? recipe.recipeDescription
        : [],
      imageSrc: recipe.imageSrc ? recipe.imageSrc : "",
      additionalImages: recipe.additionalImages ? recipe.additionalImages : [],
      tags: recipe.tags ? recipe.tags : [],
      rating: recipe.rating ? recipe.rating : 0,
      difficulty: recipe.difficulty ? recipe.difficulty : 0,
    };
  },
  fromFirestore: (snapshot, options) => {
    const recipe = snapshot.data(options);
    const userState = useUserStore();
    let updated = false;
    let cb: CreatedBy;
    if (typeof recipe.createdBy === typeof "string" || !recipe.createdBy) {
      updated = true;
      cb = { id: recipe.createdBy, name: "" };
    } else cb = recipe.createdBy;

    recipe.ingredients.forEach((el, index) => {
      if (typeof el === typeof "string") {
        updated = true;
        recipe.ingredients[index] = { menge: "", name: el };
      }
    });

    if (updated) {
      recipe.meta = {
        changed: new Date(),
        changedBy: userState.userFirestoreData.email,
      };
    }
    return Recipe.createEmptyRecipe()
      .withId(snapshot.id)
      .withCreatedBy(cb)
      .withRecipeName(recipe.recipeName)
      .withTime(recipe.time ?? new Date(Date.now()))
      .withIngredients(recipe.ingredients)
      .withImageSrc(recipe.imageSrc)
      .withAdditionalImages(recipe.additionalImages)
      .withType(recipe.type)
      .withDescription(recipe.description)
      .withRecipeDescription(recipe.recipeDescription)
      .withTags(recipe.tags)
      .withRating(recipe.rating ?? 0)
      .withActive(recipe.active)
      .withDifficulty(recipe.difficulty)
      .withMeta(recipe.meta);
  },
};
