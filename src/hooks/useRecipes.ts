"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useIngredients } from "@/hooks/useIngredients";
import { matchRecipes } from "@/lib/matchRecipes";
import { getRecipeById, listRecipes } from "@/services/recipes";

export function useRecipeCatalog() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: listRecipes,
  });
}

export function useRecipeMatches(ingredientIds: string[]) {
  const sortedIds = [...ingredientIds].sort();
  const catalog = useRecipeCatalog();
  const ingredientsQuery = useIngredients();
  const canMatch = sortedIds.length > 0 && catalog.isSuccess && ingredientsQuery.isSuccess;

  const matchesQuery = useQuery({
    queryKey: [
      "recipes",
      "by-ingredients",
      sortedIds,
      catalog.dataUpdatedAt,
      ingredientsQuery.dataUpdatedAt,
    ],
    queryFn: () =>
      matchRecipes(catalog.data ?? [], sortedIds, ingredientsQuery.data ?? []),
    enabled: canMatch,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const isLoading =
    sortedIds.length > 0 &&
    (catalog.isLoading ||
      ingredientsQuery.isLoading ||
      (matchesQuery.isPending && matchesQuery.data === undefined));

  return {
    data: matchesQuery.data,
    error: catalog.error ?? ingredientsQuery.error ?? matchesQuery.error,
    isLoading,
  };
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => getRecipeById(id),
    enabled: Boolean(id),
  });
}
