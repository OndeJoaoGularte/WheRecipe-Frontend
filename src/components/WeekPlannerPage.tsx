"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ingredientCategories } from "@/data/mocks/categories";
import { useIngredients } from "@/hooks/useIngredients";
import { useRecipeCatalog } from "@/hooks/useRecipes";
import { getIngredientNameMap } from "@/services/ingredients";
import type { Ingredient, Recipe } from "@/types/recipe";

const WEEK_DAYS = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
] as const;

type MealKey = "almoco" | "jantar";

const DEMO_PLAN: Record<string, Record<MealKey, string | null>> = {
  segunda: { almoco: "macarrao-requeijao", jantar: "omelete-simples" },
  terca: { almoco: "frango-refogado", jantar: null },
  quarta: { almoco: null, jantar: "misto-quente" },
  quinta: { almoco: "banana-aveia", jantar: null },
  sexta: { almoco: null, jantar: null },
  sabado: { almoco: null, jantar: null },
  domingo: { almoco: null, jantar: null },
};

function categoryForIngredient(
  ingredientId: string,
  ingredients: Ingredient[],
) {
  const exact = ingredients.find((item) => item.id === ingredientId);
  if (exact) return exact.category;

  const familyMember = ingredients.find((item) => item.family === ingredientId);
  return familyMember?.category ?? "mercearia";
}

function buildShoppingList(recipes: Recipe[], ingredients: Ingredient[]) {
  const names = getIngredientNameMap(ingredients);
  const grouped = new Map<string, { name: string; quantities: string[] }[]>();

  for (const recipe of recipes) {
    for (const item of recipe.ingredients) {
      if (item.optional) continue;

      const category = categoryForIngredient(item.ingredientId, ingredients);
      const list = grouped.get(category) ?? [];
      const existing = list.find((entry) => entry.name === (names.get(item.ingredientId) ?? item.ingredientId));

      if (existing) {
        existing.quantities.push(`${item.quantity} (${recipe.title})`);
      } else {
        list.push({
          name: names.get(item.ingredientId) ?? item.ingredientId,
          quantities: [`${item.quantity} (${recipe.title})`],
        });
      }

      grouped.set(category, list);
    }
  }

  return ingredientCategories
    .map((category) => ({
      category,
      items: grouped.get(category.id) ?? [],
    }))
    .filter((group) => group.items.length > 0);
}

export default function WeekPlannerPage() {
  const recipesQuery = useRecipeCatalog();
  const ingredientsQuery = useIngredients();

  const recipesById = useMemo(() => {
    return new Map((recipesQuery.data ?? []).map((recipe) => [recipe.id, recipe]));
  }, [recipesQuery.data]);

  const selectedRecipes = useMemo(() => {
    const ids = Object.values(DEMO_PLAN).flatMap((day) =>
      Object.values(day).filter((id): id is string => Boolean(id)),
    );
    return ids
      .map((id) => recipesById.get(id))
      .filter((recipe): recipe is Recipe => Boolean(recipe));
  }, [recipesById]);

  const shoppingList = useMemo(() => {
    if (!ingredientsQuery.data) return [];
    return buildShoppingList(selectedRecipes, ingredientsQuery.data);
  }, [ingredientsQuery.data, selectedRecipes]);

  return (
    <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 grid-rows-2 gap-4 overflow-hidden px-4 py-4 sm:px-6 lg:grid-cols-[minmax(320px,1.1fr)_minmax(280px,0.9fr)] lg:grid-rows-1">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60 p-4">
        <div className="shrink-0 space-y-1 pb-4">
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">
            Semana
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Monte o cardápio e veja o rancho à direita. Por enquanto a grade é um
            rascunho visual — adicionar receitas vem depois.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {WEEK_DAYS.map((day) => {
            const meals = DEMO_PLAN[day.id];

            return (
              <article
                key={day.id}
                className="rounded-xl border border-[var(--line)] bg-white/80 p-3"
              >
                <h2 className="font-display text-sm font-semibold text-[var(--secondary)]">
                  {day.label}
                </h2>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(["almoco", "jantar"] as const).map((meal) => {
                    const recipeId = meals[meal];
                    const recipe = recipeId ? recipesById.get(recipeId) : null;

                    return (
                      <div
                        key={meal}
                        className="min-h-16 rounded-lg border border-dashed border-[var(--line)] bg-[var(--background)]/70 px-3 py-2"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                          {meal === "almoco" ? "Almoço" : "Jantar"}
                        </p>
                        {recipe ? (
                          <Link
                            href={`/receitas/${recipe.id}`}
                            className="mt-1 block text-sm font-medium text-[var(--ink)] hover:text-[var(--accent-strong)]"
                          >
                            {recipe.title}
                          </Link>
                        ) : (
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            Adicionar receita
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60 p-4">
        <div className="shrink-0 space-y-1 pb-4">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Lista do rancho
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Ingredientes e quantidades para as receitas já colocadas na semana.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {shoppingList.length === 0 && (
            <div className="flex h-full min-h-40 items-center justify-center rounded-xl border border-dashed border-[var(--line)] px-4 text-center">
              <p className="text-sm text-[var(--muted)]">
                Quando houver receitas no cardápio, a lista de compras aparece
                aqui, agrupada por categoria.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {shoppingList.map((group) => (
              <section key={group.category.id}>
                <h3 className="font-display text-sm font-semibold text-[var(--secondary)]">
                  {group.category.name}
                </h3>
                <ul className="mt-2 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="rounded-lg border border-[var(--line)] bg-white/80 px-3 py-2"
                    >
                      <p className="text-sm font-medium text-[var(--ink)]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {item.quantities.join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
