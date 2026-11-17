"use client";

import Link from "next/link";
import RecipeResults from "@/components/RecipeResults";
import { useIngredientMeta } from "@/hooks/useIngredientMeta";
import { useIngredients } from "@/hooks/useIngredients";
import { usePantry } from "@/hooks/usePantry";
import { useRecipeMatches } from "@/hooks/useRecipes";
import { getIngredientNameMap } from "@/services/ingredients";

export default function CookFromPantryPage() {
  const ingredientsQuery = useIngredients();
  const metaQuery = useIngredientMeta();
  const pantry = usePantry();
  const matchesQuery = useRecipeMatches(pantry.ingredientIds);
  const ingredientNames = getIngredientNameMap(
    ingredientsQuery.data ?? [],
    metaQuery.data?.families ?? [],
  );
  const hasItems = pantry.ingredientIds.length > 0;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60 p-3 sm:p-5">
        <div className="shrink-0 space-y-3 pb-3 sm:pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h1 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
                Fazer receita
              </h1>
              <p className="text-sm text-[var(--muted)]">
                Sugestões com base nos itens salvos na sua despensa.
              </p>
            </div>
            <Link
              href="/despensa"
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--secondary)] transition hover:border-[var(--accent)]"
            >
              Editar despensa
            </Link>
          </div>

          {hasItems && (
            <p className="text-xs text-[var(--muted)]">
              {pantry.items.length}{" "}
              {pantry.items.length === 1 ? "item" : "itens"} na despensa
            </p>
          )}
        </div>

        {!hasItems && !pantry.isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[var(--line)] px-4 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              Sua despensa está vazia. Cadastre o que você tem e volte aqui.
            </p>
            <Link
              href="/despensa"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            >
              Ir para a despensa
            </Link>
          </div>
        ) : (
          <RecipeResults
            matches={matchesQuery.data ?? []}
            ingredientNames={ingredientNames}
            isLoading={matchesQuery.isLoading || pantry.isLoading}
            hasSelection={hasItems}
            error={matchesQuery.error}
          />
        )}
      </div>
    </div>
  );
}
