"use client";

import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { useRecipeCatalog } from "@/hooks/useRecipes";

export default function RecipesCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const recipesQuery = useRecipeCatalog();

  const tags = useMemo(() => {
    const unique = new Set<string>();
    for (const recipe of recipesQuery.data ?? []) {
      for (const tag of recipe.tags) unique.add(tag);
    }
    return [...unique];
  }, [recipesQuery.data]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (recipesQuery.data ?? []).filter((recipe) => {
      const matchesTag = activeTag ? recipe.tags.includes(activeTag) : true;
      if (!matchesTag) return false;
      if (!query) return true;

      const haystack = [recipe.title, recipe.description, ...recipe.tags]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [activeTag, recipesQuery.data, search]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="max-w-2xl space-y-2">
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
            Receitas
          </h1>
          <p className="text-[var(--muted)]">
            Procure um prato específico quando você já sabe o que quer — sem
            passar pela despensa.
          </p>
        </header>

        <div className="mt-6 space-y-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, tag ou descrição..."
            className="w-full max-w-xl rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={
                  activeTag === null
                    ? "rounded-full bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
                    : "rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)]"
                }
              >
                Todas
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={
                    activeTag === tag
                      ? "rounded-full bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
                      : "rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink)]"
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {recipesQuery.isLoading && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl bg-[var(--accent-soft)]/60"
              />
            ))}
          </div>
        )}

        {recipesQuery.error && (
          <p className="mt-6 text-sm text-red-700">
            Não foi possível carregar as receitas.
          </p>
        )}

        {!recipesQuery.isLoading && !recipesQuery.error && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}

        {!recipesQuery.isLoading && filtered.length === 0 && (
          <p className="mt-6 text-sm text-[var(--muted)]">
            Nenhuma receita encontrada para essa busca.
          </p>
        )}
      </div>
    </div>
  );
}
