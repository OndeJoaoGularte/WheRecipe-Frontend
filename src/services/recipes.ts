import { apiFetch } from "@/lib/api";
import type { Recipe, RecipeMatch } from "@/types/recipe";

type ListResponse = { data: Recipe[] };
type ItemResponse = { data: Recipe };
type MatchResponse = { data: RecipeMatch[] };

export async function getRecipesByIngredients(
  ingredientIds: string[],
): Promise<RecipeMatch[]> {
  const response = await apiFetch<MatchResponse>("/recipes/match", {
    method: "POST",
    body: JSON.stringify({ ingredientIds }),
  });
  return response.data;
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  try {
    const response = await apiFetch<ItemResponse>(
      `/recipes/${encodeURIComponent(id)}`,
    );
    return response.data;
  } catch {
    return undefined;
  }
}

export async function listRecipes(): Promise<Recipe[]> {
  const response = await apiFetch<ListResponse>("/recipes");
  return response.data;
}
