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
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-6xl pb-4">
        <header className="max-w-2xl space-y-2">
          <h1 className="font-display text-2xl font-bold text-[var(--ink)] sm:text-3xl">
            Receitas
          </h1>
          <p className="text-sm text-[var(--muted)] sm:text-base">
            Procure um prato específico quando você já sabe o que quer — sem
            passar pela despensa.
          </p>
        </header>

        <div className="mt-5 space-y-4 sm:mt-6">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, tag ou descrição..."
            className="w-full max-w-xl rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-base text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] sm:text-sm"
          />

          {tags.length > 0 && (
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={
                  activeTag === null
                    ? "shrink-0 rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
                    : "shrink-0 rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-[var(--ink)]"
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
                      ? "shrink-0 rounded-full bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
                      : "shrink-0 rounded-full border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-[var(--ink)]"
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
