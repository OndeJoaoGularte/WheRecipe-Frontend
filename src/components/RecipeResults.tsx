"use client";

import RecipeCard from "@/components/RecipeCard";
import type { RecipeMatch } from "@/types/recipe";

type RecipeResultsProps = {
  matches: RecipeMatch[];
  ingredientNames: Map<string, string>;
  isLoading: boolean;
  hasSelection: boolean;
  error: Error | null;
};

export default function RecipeResults({
  matches,
  ingredientNames,
  isLoading,
  hasSelection,
  error,
}: RecipeResultsProps) {
  return (
    <section className="space-y-4" aria-labelledby="results-heading">
      <div className="space-y-1">
        <h2 id="results-heading" className="font-display text-xl text-[var(--ink)]">
          Sugestões
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Receitas ordenadas pelo que mais combina com a sua despensa.
        </p>
      </div>

      {!hasSelection && (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            Selecione pelo menos um ingrediente para ver receitas.
          </p>
        </div>
      )}

      {hasSelection && isLoading && (
        <div className="space-y-3" aria-busy="true" aria-live="polite">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-[var(--accent-soft)]/60"
            />
          ))}
        </div>
      )}

      {hasSelection && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          Não foi possível carregar as receitas. Tente novamente.
        </div>
      )}

      {hasSelection && !isLoading && !error && matches.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            Nenhuma receita combina com esses ingredientes ainda. Tente adicionar
            mais itens ou mudar a combinação.
          </p>
        </div>
      )}

      {hasSelection && !isLoading && !error && matches.length > 0 && (
        <div className="space-y-3">
          {matches.map((match) => (
            <RecipeCard
              key={match.recipe.id}
              match={match}
              ingredientNames={ingredientNames}
            />
          ))}
        </div>
      )}
    </section>
  );
}
