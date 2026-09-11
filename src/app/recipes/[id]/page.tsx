"use client";

import Link from "next/link";
import { use } from "react";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecipe } from "@/hooks/useRecipes";
import { getIngredientNameMap } from "@/services/ingredients";

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatMinutes(total: number) {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = use(params);
  const recipeQuery = useRecipe(id);
  const ingredientsQuery = useIngredients();
  const ingredientNames = getIngredientNameMap(ingredientsQuery.data ?? []);

  if (recipeQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="h-8 w-40 animate-pulse rounded bg-[var(--accent-soft)]" />
        <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-[var(--accent-soft)]" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-[var(--accent-soft)]/70" />
      </div>
    );
  }

  if (recipeQuery.error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-red-700">Erro ao carregar a receita.</p>
        <Link href="/" className="mt-4 inline-block text-[var(--secondary)]">
          Voltar
        </Link>
      </div>
    );
  }

  const recipe = recipeQuery.data;

  if (!recipe) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-[var(--muted)]">Receita não encontrada.</p>
        <Link href="/" className="mt-4 inline-block text-[var(--secondary)]">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="text-sm font-medium text-[var(--secondary)] transition hover:underline"
      >
        ← Voltar
      </Link>

      <header className="mt-6 space-y-3">
        <p className="font-display text-sm font-bold tracking-wide text-[var(--secondary)]">
          WheRecipe
        </p>
        <h1 className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="max-w-2xl text-[var(--muted)]">{recipe.description}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
          <span>{formatMinutes(totalMinutes)}</span>
          <span>·</span>
          <span>
            {recipe.servings} porç{recipe.servings === 1 ? "ão" : "ões"}
          </span>
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

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-xl text-[var(--ink)]">Nutrição (média)</h2>
        <p className="text-sm text-[var(--muted)]">
          Valores aproximados para {recipe.servings} porç
          {recipe.servings === 1 ? "ão" : "ões"} no total.
        </p>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(
            [
              ["Calorias", `${recipe.nutrition.calories} kcal`],
              ["Carboidratos", `${recipe.nutrition.carbs} g`],
              ["Proteínas", `${recipe.nutrition.protein} g`],
              ["Gorduras", `${recipe.nutrition.fat} g`],
              ["Açúcar", `${recipe.nutrition.sugar} g`],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3"
            >
              <dt className="text-xs text-[var(--muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--ink)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
