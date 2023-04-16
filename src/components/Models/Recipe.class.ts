interface Description {
  nr: number;
  text: string;
  img: string;
}

interface Ingredient {
  menge: string;
  name: string;
  nr: number;
}

export default class Recipe {
  public id?: string;
  public createdBy?: string;
  public time?: Date;
  public imageSrc?: string;
  public description?: string;
  public recipeName?: string;
  public type?: string;
  public ingredients?: Ingredient[];
  public recipeDescription: Description[] = [];
  public active?: boolean;
  public tags?: string[];

  constructor(
    id?: string,
    createdBy?: string,
    time?: Date,
    imageSrc?: string,
    description?: string,
    recipeName?: string,
    type?: string,
    ingredients?: Ingredient[],
    recipeDescription: Description[] = [],
    active?: boolean,
    tags?: string[]
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

  withCreatedBy(value: string): Recipe {
    this.createdBy = value ?? "";
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

  public static createEmtptyRecipe(): Recipe {
    return new Recipe();
  }
}

export const recipeConverter = {
  toFirestore: (recipe) => {
    console.log("firestore converter gestartet", recipe);
    return {
      recipeName: recipe.recipeName,
      createdBy: recipe.createdBy,
      time: recipe.time,
      active: recipe.active,
      ingredients: recipe.ingredients,
      recipeDescription: recipe.recipeDescription,
    };
  },
  fromFirestore: (snapshot, options) => {
    const recipe = snapshot.data(options);
    return Recipe.createEmtptyRecipe()
      .withId(snapshot.id)
      .withCreatedBy(recipe.createdBy)
      .withRecipeName(recipe.recipeName)
      .withTime(recipe.time ?? new Date(Date.now()))
      .withIngredients(recipe.ingredients)
      .withImageSrc(recipe.imageSrc)
      .withType(recipe.type)
      .withDescription(recipe.description)
      .withRecipeDescription(recipe.recipeDescription)
      .withTags(recipe.tags);
  },
};
