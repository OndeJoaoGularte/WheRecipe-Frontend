import { apiFetch } from "@/lib/api";
import { getIngredientNameMap as buildIngredientNameMap } from "@/lib/ingredients";
import type {
  Ingredient,
  IngredientCategory,
  IngredientFamily,
} from "@/types/recipe";

type ListResponse = { data: Ingredient[] };
type MetaResponse = {
  data: {
    categories: IngredientCategory[];
    families: IngredientFamily[];
  };
};
type ItemResponse = { data: Ingredient };

export async function listIngredients(): Promise<Ingredient[]> {
  const response = await apiFetch<ListResponse>("/ingredients");
  return response.data;
}

export async function getIngredientById(
  id: string,
): Promise<Ingredient | undefined> {
  try {
    const response = await apiFetch<ItemResponse>(
      `/ingredients/${encodeURIComponent(id)}`,
    );
    return response.data;
  } catch {
    return undefined;
  }
}

export async function getIngredientMeta(): Promise<{
  categories: IngredientCategory[];
  families: IngredientFamily[];
}> {
  const response = await apiFetch<MetaResponse>("/ingredients/meta");
  return response.data;
}

export function getIngredientNameMap(
  ingredients: Ingredient[],
  families: IngredientFamily[] = [],
): Map<string, string> {
  return buildIngredientNameMap(ingredients, families);
}
