import { apiFetch } from "@/lib/api";
import type { PantryItem, PantryUpdate } from "@/types/pantry";

type PantryResponse = { data: PantryItem[] };

export async function getPantry(_userId?: string): Promise<PantryItem[]> {
  const response = await apiFetch<PantryResponse>("/pantry");
  return response.data;
}

export async function upsertPantryItem(
  _userId: string | undefined,
  item: PantryItem,
): Promise<PantryItem[]> {
  const quantity = item.quantity.trim();
  if (!quantity) {
    return removePantryItem(_userId, item.ingredientId);
  }

  const response = await apiFetch<PantryResponse>("/pantry/items", {
    method: "PUT",
    body: JSON.stringify({
      ingredientId: item.ingredientId,
      quantity,
    }),
  });
  return response.data;
}

export async function removePantryItem(
  _userId: string | undefined,
  ingredientId: string,
): Promise<PantryItem[]> {
  const response = await apiFetch<PantryResponse>(
    `/pantry/items/${encodeURIComponent(ingredientId)}`,
    { method: "DELETE" },
  );
  return response.data;
}

export async function applyPantryUpdates(
  _userId: string | undefined,
  updates: PantryUpdate[],
): Promise<PantryItem[]> {
  const response = await apiFetch<PantryResponse>("/pantry/apply", {
    method: "POST",
    body: JSON.stringify({ updates }),
  });
  return response.data;
}
