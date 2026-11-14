import { selectionCoversRequirement } from "@/lib/ingredients";
import type { Ingredient, Recipe } from "@/types/recipe";
import type { ConsumptionDraftItem, PantryItem } from "@/types/pantry";

export function buildConsumptionDraft(
  recipe: Recipe,
  pantry: PantryItem[],
  ingredients: Ingredient[],
): ConsumptionDraftItem[] {
  const pantryById = new Map(pantry.map((item) => [item.ingredientId, item]));
  const selectedIds = new Set(pantry.map((item) => item.ingredientId));
  const drafts: ConsumptionDraftItem[] = [];
  const seen = new Set<string>();

  for (const item of recipe.ingredients) {
    if (item.optional) continue;

    const coveredBySelection = selectionCoversRequirement(
      item.ingredientId,
      selectedIds,
      ingredients,
    );
    if (!coveredBySelection) continue;

    const exact = pantryById.get(item.ingredientId);
    const familyMatch = exact
      ? exact
      : pantry.find((entry) => {
          const ingredient = ingredients.find((i) => i.id === entry.ingredientId);
          return ingredient?.family === item.ingredientId;
        });

    if (!familyMatch || seen.has(familyMatch.ingredientId)) continue;

    seen.add(familyMatch.ingredientId);
    drafts.push({
      ingredientId: familyMatch.ingredientId,
      recipeQuantity: item.quantity,
      currentQuantity: familyMatch.quantity,
      include: true,
      remainingQuantity: "",
    });
  }

  return drafts;
}
