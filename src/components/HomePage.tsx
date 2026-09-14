"use client";

import { useState } from "react";
import IngredientPicker from "@/components/IngredientPicker";
import RecipeResults from "@/components/RecipeResults";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecipeMatches } from "@/hooks/useRecipes";
import { getIngredientNameMap } from "@/services/ingredients";

export default function HomePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const ingredientsQuery = useIngredients();
  const matchesQuery = useRecipeMatches(selectedIds);

  const ingredientNames = getIngredientNameMap(ingredientsQuery.data ?? []);

  function toggleIngredient(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
      <header className="mx-auto w-full max-w-6xl shrink-0 pb-4">
        <p className="font-display text-3xl font-bold tracking-tight text-[var(--secondary)] sm:text-4xl">
          WheRecipe
        </p>
        <p className="mt-1 max-w-xl text-sm text-[var(--muted)] sm:text-base">
          Descubra o que cozinhar com o que já tem em casa.
        </p>
      </header>

      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 grid-rows-2 gap-4 lg:grid-cols-[minmax(280px,38%)_1fr] lg:grid-rows-1 lg:gap-6">
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60 p-4">
          {ingredientsQuery.isLoading && (
            <div className="h-full animate-pulse rounded-xl bg-[var(--accent-soft)]/60" />
          )}

          {ingredientsQuery.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
              Não foi possível carregar os ingredientes.
            </div>
          )}

          {ingredientsQuery.data && (
            <IngredientPicker
              ingredients={ingredientsQuery.data}
              selectedIds={selectedIds}
              onToggle={toggleIngredient}
              search={search}
              onSearchChange={setSearch}
            />
          )}
        </aside>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60 p-4">
          <RecipeResults
            matches={matchesQuery.data ?? []}
            ingredientNames={ingredientNames}
            isLoading={matchesQuery.isFetching}
            hasSelection={selectedIds.length > 0}
            error={matchesQuery.error}
          />
        </div>
      </div>
    </div>
  );
}
