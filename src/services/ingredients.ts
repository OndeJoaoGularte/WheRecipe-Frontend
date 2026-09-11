import { mockIngredients } from "@/data/mocks/ingredients";
import type { Ingredient } from "@/types/recipe";
import { delay } from "@/services/delay";

export async function listIngredients(): Promise<Ingredient[]> {
  await delay();
  return mockIngredients;
}

export async function getIngredientById(
  id: string,
): Promise<Ingredient | undefined> {
  await delay(200);
  return mockIngredients.find((ingredient) => ingredient.id === id);
}

export function getIngredientNameMap(
  ingredients: Ingredient[],
): Map<string, string> {
  return new Map(ingredients.map((ingredient) => [ingredient.id, ingredient.name]));
}
