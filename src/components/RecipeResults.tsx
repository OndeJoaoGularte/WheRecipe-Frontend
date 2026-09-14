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
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-labelledby="results-heading"
    >
      <div className="shrink-0 space-y-1 pb-4">
        <h2
          id="results-heading"
          className="font-display text-xl font-semibold text-[var(--ink)]"
        >
          Receitas
        </h2>
        <p className="text-sm text-[var(--muted)]">
          {hasSelection
            ? isLoading
              ? "Buscando receitas com os ingredientes selecionados..."
              : `${matches.length} ${matches.length === 1 ? "opção" : "opções"} com o que você selecionou.`
            : "As sugestões aparecem aqui conforme você escolhe os ingredientes."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {!hasSelection && (
          <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-8 text-center">
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
          <div className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              Nenhuma receita combina com esses ingredientes ainda. Tente
              adicionar mais itens ou mudar a combinação.
            </p>
          </div>
        )}

        {hasSelection && !isLoading && !error && matches.length > 0 && (
          <div className="space-y-3 pb-2">
            {matches.map((match) => (
            <RecipeCard
              key={match.recipe.id}
              recipe={match.recipe}
              match={match}
              ingredientNames={ingredientNames}
            />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
