"use client";

import Link from "next/link";
import PantryPanel from "@/components/PantryPanel";
import { useIngredients } from "@/hooks/useIngredients";
import { usePantry } from "@/hooks/usePantry";

export default function PantryPage() {
  const ingredientsQuery = useIngredients();
  const pantry = usePantry();
  const isSaving = pantry.upsert.isPending || pantry.remove.isPending;
  const hasItems = pantry.items.length > 0;

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6">
      <div className="shrink-0 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
            Despensa
          </h1>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            À esquerda você escolhe o que tem; à direita ficam os itens salvos.
            Depois use “Fazer receita”.
          </p>
        </div>

        {hasItems ? (
          <Link
            href="/cozinhar"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Fazer receita
          </Link>
        ) : (
          <p className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
            Adicione um item para liberar “Fazer receita”
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {(ingredientsQuery.isLoading || pantry.isLoading) && (
          <div className="h-full min-h-48 animate-pulse rounded-2xl bg-[var(--accent-soft)]/60" />
        )}

        {(ingredientsQuery.error || pantry.error) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            Não foi possível carregar a despensa.
          </div>
        )}

        {ingredientsQuery.data && !pantry.isLoading && !pantry.error && (
          <PantryPanel
            ingredients={ingredientsQuery.data}
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
