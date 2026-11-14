"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getRecipeById,
  getRecipesByIngredients,
  listRecipes,
} from "@/services/recipes";

export function useRecipeCatalog() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: listRecipes,
  });
}

export function useRecipeMatches(ingredientIds: string[]) {
  const sortedIds = [...ingredientIds].sort();

  const matchesQuery = useQuery({
    queryKey: ["recipes", "by-ingredients", sortedIds],
    queryFn: () => getRecipesByIngredients(sortedIds),
    enabled: sortedIds.length > 0,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  return {
    data: matchesQuery.data,
    error: matchesQuery.error,
    isLoading:
      sortedIds.length > 0 &&
      matchesQuery.isPending &&
      matchesQuery.data === undefined,
  };
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipeById(id),
    enabled: Boolean(id),
  });
}
