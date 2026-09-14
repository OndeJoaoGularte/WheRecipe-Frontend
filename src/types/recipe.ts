export const INGREDIENT_CATEGORY_IDS = [
  "laticinios",
  "frios",
  "carnes",
  "graos",
  "massas",
  "legumes",
  "frutas",
  "temperos",
  "oleos",
  "mercearia",
] as const;

export type IngredientCategoryId = (typeof INGREDIENT_CATEGORY_IDS)[number];

export type IngredientCategory = {
  id: IngredientCategoryId;
  name: string;
};

export type IngredientFamily = {
  id: string;
  name: string;
};

export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategoryId;
  family?: string;
  aliases?: string[];
};

export type Nutrition = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
};

export type RecipeIngredient = {
  ingredientId: string;
  quantity: string;
  optional?: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  nutrition: Nutrition;
  tags: string[];
};

export type RecipeMatch = {
  recipe: Recipe;
  matchedIngredientIds: string[];
  missingIngredientIds: string[];
  matchRatio: number;
  isComplete: boolean;
};
