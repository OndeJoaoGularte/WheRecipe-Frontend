"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import {
  applyPantryUpdates,
  getPantry,
  removePantryItem,
  upsertPantryItem,
} from "@/services/pantry";
import type { PantryItem, PantryUpdate } from "@/types/pantry";

function pantryKey(userId: string) {
  return ["pantry", userId] as const;
}

const EMPTY_PANTRY: PantryItem[] = [];

export function usePantry() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery({
    queryKey: pantryKey(userId ?? "anonymous"),
    queryFn: () => getPantry(userId!),
    enabled: Boolean(userId),
  });

  const cancelPantryQueries = async () => {
    if (!userId) return;
    await queryClient.cancelQueries({ queryKey: pantryKey(userId) });
  };

  const upsert = useMutation({
    mutationFn: (item: PantryItem) => upsertPantryItem(userId!, item),
    onMutate: cancelPantryQueries,
    onSuccess: (items) => {
      if (!userId) return;
      queryClient.setQueryData(pantryKey(userId), items);
    },
  });

  const remove = useMutation({
    mutationFn: (ingredientId: string) => removePantryItem(userId!, ingredientId),
    onMutate: cancelPantryQueries,
    onSuccess: (items) => {
      if (!userId) return;
      queryClient.setQueryData(pantryKey(userId), items);
    },
  });

  const applyUpdates = useMutation({
    mutationFn: (updates: PantryUpdate[]) => applyPantryUpdates(userId!, updates),
    onMutate: cancelPantryQueries,
    onSuccess: (items) => {
      if (!userId) return;
      queryClient.setQueryData(pantryKey(userId), items);
    },
  });

  const items = query.data ?? EMPTY_PANTRY;

  return {
    items,
    ingredientIds: items.map((item) => item.ingredientId),
    isLoading: query.isLoading,
    error: query.error,
    upsert,
    remove,
    applyUpdates,
  };
}
