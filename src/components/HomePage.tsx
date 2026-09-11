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
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12">
      <header className="space-y-4">
        <p className="font-display text-4xl font-bold tracking-tight text-[var(--secondary)] sm:text-5xl">
          WheRecipe
        </p>
        <div className="space-y-2">
          <h1 className="max-w-xl text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-3xl">
            Descubra o que cozinhar com o que já tem.
          </h1>
          <p className="max-w-lg text-[var(--muted)]">
            Informe os ingredientes da sua despensa e receba opções práticas sem
            precisar ir ao mercado.
          </p>
        </div>
      </header>

      {ingredientsQuery.isLoading && (
        <div className="h-40 animate-pulse rounded-2xl bg-[var(--accent-soft)]/60" />
      )}

      {ingredientsQuery.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
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

      <RecipeResults
        matches={matchesQuery.data ?? []}
        ingredientNames={ingredientNames}
        isLoading={matchesQuery.isFetching}
        hasSelection={selectedIds.length > 0}
        error={matchesQuery.error}
      />
    </div>
  );
}
