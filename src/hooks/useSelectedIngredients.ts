"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "wherecipe.selected-ingredients";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readRaw() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function parseIds(raw: string) {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function useSelectedIngredients() {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  const selectedIds = useMemo(() => parseIds(raw), [raw]);

  const setSelectedIds = useCallback(
    (update: string[] | ((current: string[]) => string[])) => {
      const current = parseIds(readRaw());
      const next = typeof update === "function" ? update(current) : update;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      emit();
    },
    [],
  );

  return [selectedIds, setSelectedIds] as const;
}
