import { selectionCoversRequirement } from "@/lib/ingredients";
import type { Ingredient, Recipe, RecipeMatch } from "@/types/recipe";

function buildMatch(
  recipe: Recipe,
  selectedIds: Set<string>,
  ingredients: Ingredient[],
): RecipeMatch | null {
  const required = recipe.ingredients.filter((item) => !item.optional);
  const matchedIngredientIds: string[] = [];
  const missingIngredientIds: string[] = [];

  for (const item of required) {
    if (selectionCoversRequirement(item.ingredientId, selectedIds, ingredients)) {
      matchedIngredientIds.push(item.ingredientId);
    } else {
      missingIngredientIds.push(item.ingredientId);
    }
  }

  if (matchedIngredientIds.length === 0) {
    return null;
  }

  const matchRatio = matchedIngredientIds.length / required.length;

  return {
    recipe,
    matchedIngredientIds,
    missingIngredientIds,
    matchRatio,
    isComplete: missingIngredientIds.length === 0,
  };
}

export function matchRecipes(
  recipes: Recipe[],
  ingredientIds: string[],
  ingredients: Ingredient[],
): RecipeMatch[] {
  if (ingredientIds.length === 0) {
    return [];
  }

  const selected = new Set(ingredientIds);

  return recipes
    .map((recipe) => buildMatch(recipe, selected, ingredients))
    .filter((match): match is RecipeMatch => match !== null)
    .sort((a, b) => {
      if (a.isComplete !== b.isComplete) {
        return a.isComplete ? -1 : 1;
      }
      if (b.matchRatio !== a.matchRatio) {
        return b.matchRatio - a.matchRatio;
      }
      if (a.missingIngredientIds.length !== b.missingIngredientIds.length) {
        return a.missingIngredientIds.length - b.missingIngredientIds.length;
      }
      return b.matchedIngredientIds.length - a.matchedIngredientIds.length;
    });
}
