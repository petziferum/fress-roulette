import * as string_decoder from "string_decoder";

export interface Description {
  nr: number;
  text: string;
  img: string;
}

export interface Ingredient {
  menge: string;
  name: string;
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
  public description?: string;
  public recipeName?: string;
  public type?: string;
  public ingredients?: Ingredient[];
  public recipeDescription: Description[] = [];
  public active?: boolean;
  public tags?: string[];
  public rating?: number = 3.8;

  constructor(
    id: string,
    createdBy?: CreatedBy,
    time?: Date,
    imageSrc?: string,
    description?: string,
    recipeName?: string,
    type?: string,
    ingredients?: Ingredient[],
    recipeDescription: Description[] = [],
    active?: boolean,
    tags?: string[],
    rating?: number
  ) {
    this.id = id;
    this.createdBy = createdBy;
    this.time = time;
    this.imageSrc = imageSrc;
    this.description = description;
    this.type = type;
    this.ingredients = ingredients;
    this.recipeDescription = recipeDescription;
    this.active = active;
    this.tags = tags;
    this.rating = rating;
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
  toFirestore: (recipe) => {
    console.log("firestore converter gestartet", recipe.recipeName);
    return {
      recipeName: recipe.recipeName,
      createdBy: recipe.createdBy,
      time: recipe.time,
      active: recipe.active,
      ingredients: recipe.ingredients ? recipe.ingredients : [],
      recipeDescription: recipe.recipeDescription,
      imageSrc: recipe.imageSrc,
      tags: recipe.tags,
      rating: recipe.rating,
    };
  },
  fromFirestore: (snapshot, options) => {
    const recipe = snapshot.data(options);
    let cb: CreatedBy;
    if (typeof recipe.createdBy === typeof "string") {
      console.log("createdBy ist nur n string yo", recipe.recipeName);
      cb = { id: recipe.createdBy, name: "" };
    } else cb = recipe.createdBy;
    return Recipe.createEmptyRecipe()
      .withId(snapshot.id)
      .withCreatedBy(cb)
      .withRecipeName(recipe.recipeName)
      .withTime(recipe.time ?? new Date(Date.now()))
      .withIngredients(recipe.ingredients)
      .withImageSrc(recipe.imageSrc)
      .withType(recipe.type)
      .withDescription(recipe.description)
      .withRecipeDescription(recipe.recipeDescription)
      .withTags(recipe.tags)
      .withRating(3.8);
  },
};
