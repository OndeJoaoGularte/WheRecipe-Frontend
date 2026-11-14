"use client";

import { useQuery } from "@tanstack/react-query";
import { getIngredientMeta } from "@/services/ingredients";

export function useIngredientMeta() {
  return useQuery({
    queryKey: ["ingredients", "meta"],
    queryFn: getIngredientMeta,
    staleTime: Infinity,
  });
}
