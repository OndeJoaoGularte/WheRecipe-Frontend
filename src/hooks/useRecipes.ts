"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecipeById, getRecipesByIngredients } from "@/services/recipes";

export function useRecipeMatches(ingredientIds: string[]) {
  const sortedIds = [...ingredientIds].sort();

  return useQuery({
    queryKey: ["recipes", "by-ingredients", sortedIds],
    queryFn: () => getRecipesByIngredients(sortedIds),
    enabled: sortedIds.length > 0,
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipeById(id),
    enabled: Boolean(id),
  });
}
