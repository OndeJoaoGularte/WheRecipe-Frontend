import Link from "next/link";
import { formatMinutes, formatServings } from "@/lib/format";
import type { Recipe, RecipeMatch } from "@/types/recipe";

type RecipeCardProps = {
  recipe: Recipe;
  match?: Pick<
    RecipeMatch,
    "matchedIngredientIds" | "missingIngredientIds" | "isComplete" | "matchRatio"
  >;
  ingredientNames?: Map<string, string>;
};

export default function RecipeCard({
  recipe,
  match,
  ingredientNames,
}: RecipeCardProps) {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const percent = match ? Math.round(match.matchRatio * 100) : null;

  return (
    <Link
      href={`/receitas/${recipe.id}`}
      className="group block rounded-2xl border border-[var(--line)] bg-white/75 p-4 transition hover:border-[var(--accent)] hover:bg-white hover:shadow-[0_10px_30px_rgba(249,115,22,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--secondary)]">
            {recipe.title}
          </h3>
          <p className="text-sm text-[var(--muted)] line-clamp-2">
            {recipe.description}
          </p>
        </div>
        {match && percent !== null && (
          <span
            className={
              match.isComplete
                ? "shrink-0 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-white"
                : "shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]"
            }
          >
            {match.isComplete ? "Completa" : `${percent}%`}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
        <span>{formatMinutes(totalMinutes)}</span>
        <span>·</span>
        <span>{formatServings(recipe.servings)}</span>
        {match && (
          <>
            <span>·</span>
            <span>
              {match.matchedIngredientIds.length} de{" "}
              {match.matchedIngredientIds.length + match.missingIngredientIds.length}{" "}
              ingredientes
            </span>
          </>
        )}
      </div>

      {recipe.tags.length > 0 && !match && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-strong)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {match && match.missingIngredientIds.length > 0 && (
        <p className="mt-3 text-xs text-[var(--warn)]">
          Falta:{" "}
          {match.missingIngredientIds
            .map((id) => ingredientNames?.get(id) ?? id)
            .join(", ")}
        </p>
      )}
    </Link>
  );
}
