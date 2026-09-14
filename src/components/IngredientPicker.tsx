"use client";

import { useMemo, useState } from "react";
import { groupIngredientsByCategory } from "@/lib/ingredients";
import type { Ingredient } from "@/types/recipe";

type IngredientPickerProps = {
  ingredients: Ingredient[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
};

export default function IngredientPicker({
  ingredients,
  selectedIds,
  onToggle,
  search,
  onSearchChange,
}: IngredientPickerProps) {
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);
  const normalizedSearch = search.trim().toLowerCase();
  const isSearching = normalizedSearch.length > 0;

  const grouped = useMemo(
    () => groupIngredientsByCategory(ingredients, search),
    [ingredients, search],
  );

  const selected = ingredients.filter((ingredient) =>
    selectedIds.includes(ingredient.id),
  );

  function toggleCategory(id: string) {
    setOpenCategoryIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-labelledby="ingredients-heading"
    >
      <div className="shrink-0 space-y-3">
        <div className="space-y-1">
          <h2
            id="ingredients-heading"
            className="font-display text-xl font-semibold text-[var(--ink)]"
          >
            Ingredientes
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Abra uma categoria e clique no que você tem em casa.
          </p>
        </div>

        <label className="block">
          <span className="sr-only">Buscar ingredientes</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar ingrediente ou categoria..."
            className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
        </label>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Selecionados">
            {selected.map((ingredient) => (
              <button
                key={ingredient.id}
                type="button"
                onClick={() => onToggle(ingredient.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
              >
                {ingredient.name}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="space-y-2">
          {grouped.map(({ category, ingredients: items }) => {
            const isOpen = isSearching || openCategoryIds.includes(category.id);
            const selectedInCategory = items.filter((item) =>
              selectedIds.includes(item.id),
            ).length;

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-[var(--line)] bg-white/70"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!isSearching) toggleCategory(category.id);
                  }}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                >
                  <span className="font-display text-sm font-semibold text-[var(--ink)]">
                    {category.name}
                  </span>
                  <span className="flex items-center gap-2">
                    {selectedInCategory > 0 && (
                      <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-strong)]">
                        {selectedInCategory}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className={`text-[var(--muted)] transition ${isOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="space-y-2 border-t border-[var(--line)] px-3 py-3">
                    {items.map((ingredient) => {
                      const isSelected = selectedIds.includes(ingredient.id);

                      return (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => onToggle(ingredient.id)}
                          aria-pressed={isSelected}
                          className={
                            isSelected
                              ? "w-full rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2.5 text-left text-sm font-medium text-[var(--accent-strong)]"
                              : "w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-left text-sm text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                          }
                        >
                          {ingredient.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {grouped.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            Nenhum ingrediente encontrado para “{search}”.
          </p>
        )}
      </div>
    </section>
  );
}
