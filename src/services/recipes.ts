import { mockIngredients } from "@/data/mocks/ingredients";
import { mockRecipes } from "@/data/mocks/recipes";
import { matchRecipes } from "@/lib/matchRecipes";
import type { Recipe, RecipeMatch } from "@/types/recipe";
import { delay } from "@/services/delay";

export async function getRecipesByIngredients(
  ingredientIds: string[],
): Promise<RecipeMatch[]> {
  await delay();
  return matchRecipes(mockRecipes, ingredientIds, mockIngredients);
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  await delay();
  return mockRecipes.find((recipe) => recipe.id === id);
}

export async function listRecipes(): Promise<Recipe[]> {
  await delay();
  return mockRecipes;
}
