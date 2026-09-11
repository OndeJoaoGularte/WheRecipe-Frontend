import { mockRecipes } from "@/data/mocks/recipes";
import type { Recipe, RecipeMatch } from "@/types/recipe";
import { delay } from "@/services/delay";

function buildMatch(
  recipe: Recipe,
  selectedIds: Set<string>,
): RecipeMatch | null {
  const required = recipe.ingredients.filter((item) => !item.optional);
  const matchedIngredientIds: string[] = [];
  const missingIngredientIds: string[] = [];

  for (const item of required) {
    if (selectedIds.has(item.ingredientId)) {
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

export async function getRecipesByIngredients(
  ingredientIds: string[],
): Promise<RecipeMatch[]> {
  await delay();

  if (ingredientIds.length === 0) {
    return [];
  }

  const selected = new Set(ingredientIds);

  return mockRecipes
    .map((recipe) => buildMatch(recipe, selected))
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

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  await delay();
  return mockRecipes.find((recipe) => recipe.id === id);
}

export async function listRecipes(): Promise<Recipe[]> {
  await delay();
  return mockRecipes;
}
