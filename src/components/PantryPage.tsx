"use client";

import Link from "next/link";
import PantryPanel from "@/components/PantryPanel";
import { useIngredientMeta } from "@/hooks/useIngredientMeta";
import { useIngredients } from "@/hooks/useIngredients";
import { usePantry } from "@/hooks/usePantry";

export default function PantryPage() {
  const ingredientsQuery = useIngredients();
  const metaQuery = useIngredientMeta();
  const pantry = usePantry();
  const isSaving = pantry.upsert.isPending || pantry.remove.isPending;
  const hasItems = pantry.items.length > 0;
  const isLoading =
    ingredientsQuery.isLoading || metaQuery.isLoading || pantry.isLoading;

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-6 sm:py-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3 sm:mb-4 lg:shrink-0">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
            Despensa
          </h1>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            <span className="lg:hidden">
              Adicione o que tem e confira os itens salvos. Depois use “Cozinhar”.
            </span>
            <span className="hidden lg:inline">
              À esquerda você escolhe o que tem; à direita ficam os itens salvos.
              Depois use “Fazer receita”.
            </span>
          </p>
        </div>

        {hasItems ? (
          <Link
            href="/cozinhar"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Fazer receita
          </Link>
        ) : (
          <p className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
            Adicione um item para liberar “Fazer receita”
          </p>
        )}
      </div>

      <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
        {isLoading && (
          <div className="h-48 animate-pulse rounded-2xl bg-[var(--accent-soft)]/60 lg:h-full" />
        )}

        {(ingredientsQuery.error || metaQuery.error || pantry.error) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            Não foi possível carregar a despensa.
          </div>
        )}

        {ingredientsQuery.data &&
          metaQuery.data &&
          !pantry.isLoading &&
          !pantry.error && (
            <PantryPanel
              ingredients={ingredientsQuery.data}
              categories={metaQuery.data.categories}
              items={pantry.items}
              isSaving={isSaving}
              onUpsert={(item) => pantry.upsert.mutate(item)}
              onRemove={(ingredientId) => pantry.remove.mutate(ingredientId)}
            />
          )}
      </div>
    </div>
  );
}
