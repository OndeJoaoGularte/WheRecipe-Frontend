"use client";

import { useQuery } from "@tanstack/react-query";
import { listIngredients } from "@/services/ingredients";

export function useIngredients() {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: listIngredients,
  });
}
