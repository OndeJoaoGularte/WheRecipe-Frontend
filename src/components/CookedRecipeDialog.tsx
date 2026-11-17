"use client";

import { useEffect, useMemo, useState } from "react";
import { buildConsumptionDraft } from "@/lib/consumption";
import type { Ingredient, Recipe } from "@/types/recipe";
import type { ConsumptionDraftItem, PantryItem, PantryUpdate } from "@/types/pantry";

type CookedRecipeDialogProps = {
  open: boolean;
  recipe: Recipe;
  pantry: PantryItem[];
  ingredients: Ingredient[];
  ingredientNames: Map<string, string>;
  isLoadingPantry?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onConfirm: (updates: PantryUpdate[]) => void;
};

export default function CookedRecipeDialog({
  open,
  recipe,
  pantry,
  ingredients,
  ingredientNames,
  isLoadingPantry = false,
  isSaving = false,
  onClose,
  onConfirm,
}: CookedRecipeDialogProps) {
  const suggested = useMemo(
    () =>
      open && !isLoadingPantry
        ? buildConsumptionDraft(recipe, pantry, ingredients)
        : [],
    [open, isLoadingPantry, recipe, pantry, ingredients],
  );

  const [overrides, setOverrides] = useState<
    Record<string, Partial<ConsumptionDraftItem>>
  >({});

  useEffect(() => {
    if (open) setOverrides({});
  }, [open, recipe.id]);

  const drafts = useMemo(
    () =>
      suggested.map((item) => ({
        ...item,
        ...overrides[item.ingredientId],
      })),
    [suggested, overrides],
  );

  if (!open) return null;

  function resetAndClose() {
    setOverrides({});
    onClose();
  }

  function updateDraft(
    ingredientId: string,
    patch: Partial<ConsumptionDraftItem>,
  ) {
    setOverrides((current) => ({
      ...current,
      [ingredientId]: { ...current[ingredientId], ...patch },
    }));
  }

  function handleConfirm() {
    const updates: PantryUpdate[] = drafts
      .filter((item) => item.include)
      .map((item) => ({
        ingredientId: item.ingredientId,
        quantity: item.remainingQuantity.trim()
          ? item.remainingQuantity.trim()
          : null,
      }));

    onConfirm(updates);
    setOverrides({});
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cooked-dialog-title"
    >
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[var(--line)] bg-[var(--background)] shadow-xl sm:rounded-2xl">
        <div className="space-y-1 border-b border-[var(--line)] px-4 py-4 sm:px-5">
          <h2
            id="cooked-dialog-title"
            className="font-display text-xl font-semibold text-[var(--ink)]"
          >
            Atualizar despensa
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Você decide o que baixar. Deixe em branco para remover o item, ou
            informe o que ainda resta (ex.: 1/2 pacote).
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 sm:max-h-[55dvh] sm:px-5">
          {isLoadingPantry && (
            <p className="text-sm text-[var(--muted)]">Carregando despensa...</p>
          )}

          {!isLoadingPantry && drafts.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--line)] px-3 py-4 text-sm text-[var(--muted)]">
              Nenhum item desta receita está na sua despensa. Nada será alterado.
            </p>
          )}

          {drafts.map((item) => {
            const name =
              ingredientNames.get(item.ingredientId) ?? item.ingredientId;

            return (
              <div
                key={item.ingredientId}
                className="rounded-xl border border-[var(--line)] bg-white/80 p-3"
              >
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.include}
                    onChange={(event) =>
                      updateDraft(item.ingredientId, {
                        include: event.target.checked,
                      })
                    }
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      Na receita: {item.recipeQuantity} · Na despensa:{" "}
                      {item.currentQuantity}
                    </span>
                  </span>
                </label>

                {item.include && (
                  <label className="mt-3 block space-y-1.5 pl-7">
                    <span className="text-xs font-medium text-[var(--muted)]">
                      Quanto ainda resta? (vazio = remover)
                    </span>
                    <input
                      value={item.remainingQuantity}
                      onChange={(event) =>
                        updateDraft(item.ingredientId, {
                          remainingQuantity: event.target.value,
                        })
                      }
                      placeholder="Ex.: 1/4 pacote"
                      className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2.5 text-base outline-none focus:border-[var(--accent)] sm:text-sm"
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[var(--line)] px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:flex-wrap sm:justify-end sm:px-5 sm:pb-4">
          <button
            type="button"
            onClick={resetAndClose}
            className="min-h-11 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-white/70"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || isLoadingPantry}
            className="min-h-11 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Confirmar baixa"}
          </button>
        </div>
      </div>
    </div>
  );
}
