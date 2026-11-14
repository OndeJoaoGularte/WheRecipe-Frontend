import type {
  Ingredient,
  IngredientCategory,
  IngredientFamily,
} from "@/types/recipe";

export function getIngredientNameMap(
  ingredients: Ingredient[],
  families: IngredientFamily[] = [],
): Map<string, string> {
  const map = new Map(families.map((family) => [family.id, family.name]));

  for (const ingredient of ingredients) {
    map.set(ingredient.id, ingredient.name);
  }

  return map;
}

export function ingredientMatchesQuery(
  ingredient: Ingredient,
  query: string,
  categoryName?: string,
): boolean {
  if (!query) return true;

  const haystack = [
    ingredient.name,
    ingredient.family ?? "",
    categoryName ?? "",
    ...(ingredient.aliases ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function groupIngredientsByCategory(
  ingredients: Ingredient[],
  categories: IngredientCategory[],
  query = "",
): Array<{ category: IngredientCategory; ingredients: Ingredient[] }> {
  const normalizedQuery = query.trim().toLowerCase();

  return categories.flatMap((category) => {
    const items = ingredients.filter((ingredient) => {
      if (ingredient.category !== category.id) return false;
      return ingredientMatchesQuery(ingredient, normalizedQuery, category.name);
    });

    if (items.length === 0) return [];
    return [{ category, ingredients: items }];
  });
}

export function selectionCoversRequirement(
  requiredId: string,
  selectedIds: Set<string>,
  ingredients: Ingredient[],
): boolean {
  if (selectedIds.has(requiredId)) return true;

  const byId = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

  for (const selectedId of selectedIds) {
    const selected = byId.get(selectedId);
    if (selected?.family === requiredId) return true;
  }

  return false;
}
