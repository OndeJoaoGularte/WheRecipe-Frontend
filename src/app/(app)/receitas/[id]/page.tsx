"use client";

import Link from "next/link";
import { use, useState } from "react";
import CookedRecipeDialog from "@/components/CookedRecipeDialog";
import { useIngredients } from "@/hooks/useIngredients";
import { usePantry } from "@/hooks/usePantry";
import { useRecipe } from "@/hooks/useRecipes";
import { formatMinutes, formatServings } from "@/lib/format";
import { getIngredientNameMap } from "@/services/ingredients";
import type { PantryUpdate } from "@/types/pantry";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = use(params);
  const recipeQuery = useRecipe(id);
  const ingredientsQuery = useIngredients();
  const pantry = usePantry();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const ingredientNames = getIngredientNameMap(ingredientsQuery.data ?? []);

  if (recipeQuery.isLoading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <div className="h-8 w-40 animate-pulse rounded bg-[var(--accent-soft)]" />
          <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-[var(--accent-soft)]" />
          <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[var(--accent-soft)]/70" />
        </div>
      </div>
    );
  }

  if (recipeQuery.error) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <p className="text-sm text-red-700">Erro ao carregar a receita.</p>
        <Link href="/receitas" className="mt-4 inline-block text-[var(--secondary)]">
          Voltar
        </Link>
      </div>
    );
  }

  const recipe = recipeQuery.data;

  if (!recipe) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Receita não encontrada.</p>
        <Link href="/receitas" className="mt-4 inline-block text-[var(--secondary)]">
          Voltar para receitas
        </Link>
      </div>
    );
  }

  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  function handleConfirm(updates: PantryUpdate[]) {
    pantry.applyUpdates.mutate(updates, {
      onSuccess: () => {
        setDialogOpen(false);
        setFeedback(
          updates.length === 0
            ? "Nenhuma alteração na despensa."
            : "Despensa atualizada com a sua escolha.",
        );
      },
    });
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <article className="mx-auto w-full max-w-3xl pb-10">
        <Link
          href="/receitas"
          className="text-sm font-medium text-[var(--secondary)] transition hover:underline"
        >
          ← Voltar às receitas
        </Link>

        <header className="mt-6 space-y-3">
          <h1 className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="max-w-2xl text-[var(--muted)]">{recipe.description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
            <span>{formatMinutes(totalMinutes)}</span>
            <span>·</span>
            <span>{formatServings(recipe.servings)}</span>
            <span>·</span>
            <span>
              Prep {recipe.prepTimeMinutes} min · Cozimento {recipe.cookTimeMinutes}{" "}
              min
            </span>
          </div>
        </header>

        <section className="mt-8 space-y-3">
          <h2 className="font-display text-xl text-[var(--ink)]">Ingredientes</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((item) => (
              <li
                key={`${item.ingredientId}-${item.quantity}`}
                className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] py-2 text-sm"
              >
                <span className="text-[var(--ink)]">
                  {ingredientNames.get(item.ingredientId) ?? item.ingredientId}
                  {item.optional ? (
                    <span className="ml-2 text-xs text-[var(--muted)]">(opcional)</span>
                  ) : null}
                </span>
                <span className="shrink-0 text-[var(--muted)]">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-display text-xl text-[var(--ink)]">Modo de preparo</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-[var(--ink)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--highlight)] text-xs font-semibold text-[var(--ink)]">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-10 space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
            Fiz esta receita
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Vamos sugerir o que baixar da despensa. Você confirma cada item e pode
            deixar sobras como 1/2 pacote.
          </p>
          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setDialogOpen(true);
            }}
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Atualizar despensa
          </button>
          {feedback && (
            <p className="text-sm font-medium text-[var(--secondary)]">{feedback}</p>
          )}
        </div>
      </article>

      {ingredientsQuery.data && (
        <CookedRecipeDialog
          open={dialogOpen}
          recipe={recipe}
          pantry={pantry.items}
          ingredients={ingredientsQuery.data}
          ingredientNames={ingredientNames}
          isLoadingPantry={pantry.isLoading}
          isSaving={pantry.applyUpdates.isPending}
          onClose={() => setDialogOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
