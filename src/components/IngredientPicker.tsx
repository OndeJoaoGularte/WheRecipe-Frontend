"use client";

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
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = ingredients.filter((ingredient) => {
    if (!normalizedSearch) return true;

    const haystack = [ingredient.name, ...(ingredient.aliases ?? [])]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const selected = ingredients.filter((ingredient) =>
    selectedIds.includes(ingredient.id),
  );

  return (
    <section className="space-y-4" aria-labelledby="ingredients-heading">
      <div className="space-y-2">
        <h2 id="ingredients-heading" className="font-display text-xl text-[var(--ink)]">
          O que você tem em casa?
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Selecione os ingredientes disponíveis. Quanto mais você marcar, melhores
          serão as sugestões.
        </p>
      </div>

      <label className="block">
        <span className="sr-only">Buscar ingredientes</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar ingrediente..."
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

      <div className="flex flex-wrap gap-2">
        {filtered.map((ingredient) => {
          const isSelected = selectedIds.includes(ingredient.id);

          return (
            <button
              key={ingredient.id}
              type="button"
              onClick={() => onToggle(ingredient.id)}
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-strong)]"
                  : "rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              }
            >
              {ingredient.name}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            Nenhum ingrediente encontrado para “{search}”.
          </p>
        )}
      </div>
    </section>
  );
}
