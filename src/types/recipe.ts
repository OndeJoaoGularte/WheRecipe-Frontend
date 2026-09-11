export type Ingredient = {
  id: string;
  name: string;
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
