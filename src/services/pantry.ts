import { readJson, writeJson } from "@/lib/storage";
import { delay } from "@/services/delay";
import type { PantryItem, PantryUpdate } from "@/types/pantry";

function storageKey(userId: string) {
  return `wherecipe.pantry.${userId}`;
}

export async function getPantry(userId: string): Promise<PantryItem[]> {
  await delay(100);
  return readJson<PantryItem[]>(storageKey(userId), []);
}

function writePantry(userId: string, items: PantryItem[]): PantryItem[] {
  const cleaned = items
    .map((item) => ({
      ingredientId: item.ingredientId,
      quantity: item.quantity.trim(),
    }))
    .filter((item) => item.ingredientId && item.quantity);

  writeJson(storageKey(userId), cleaned);
  return cleaned;
}

export async function setPantry(
  userId: string,
  items: PantryItem[],
): Promise<PantryItem[]> {
  await delay(150);
  return writePantry(userId, items);
}

export async function upsertPantryItem(
  userId: string,
  item: PantryItem,
): Promise<PantryItem[]> {
  await delay(150);
  const current = readJson<PantryItem[]>(storageKey(userId), []);
  const quantity = item.quantity.trim();
  if (!quantity) {
    return writePantry(
      userId,
      current.filter((entry) => entry.ingredientId !== item.ingredientId),
    );
  }

  const next = current.filter((entry) => entry.ingredientId !== item.ingredientId);
  next.push({ ingredientId: item.ingredientId, quantity });
  return writePantry(userId, next);
}

export async function removePantryItem(
  userId: string,
  ingredientId: string,
): Promise<PantryItem[]> {
  await delay(150);
  const current = readJson<PantryItem[]>(storageKey(userId), []);
  return writePantry(
    userId,
    current.filter((item) => item.ingredientId !== ingredientId),
  );
}

export async function applyPantryUpdates(
  userId: string,
  updates: PantryUpdate[],
): Promise<PantryItem[]> {
  await delay(150);
  const current = readJson<PantryItem[]>(storageKey(userId), []);
  const byId = new Map(current.map((item) => [item.ingredientId, item]));

  for (const update of updates) {
    if (update.quantity === null || update.quantity.trim() === "") {
      byId.delete(update.ingredientId);
      continue;
    }

    byId.set(update.ingredientId, {
      ingredientId: update.ingredientId,
      quantity: update.quantity.trim(),
    });
  }

  return writePantry(userId, [...byId.values()]);
}
