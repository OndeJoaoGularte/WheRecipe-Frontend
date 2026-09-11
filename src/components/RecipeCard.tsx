import Link from "next/link";
import type { RecipeMatch } from "@/types/recipe";

type RecipeCardProps = {
  match: RecipeMatch;
  ingredientNames: Map<string, string>;
};

function formatMinutes(total: number) {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export default function RecipeCard({ match, ingredientNames }: RecipeCardProps) {
  const { recipe, matchedIngredientIds, missingIngredientIds, isComplete, matchRatio } =
    match;
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const percent = Math.round(matchRatio * 100);

  return (
    <Link
      href={`/recipes/${recipe.id}`}
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
        <span
          className={
            isComplete
              ? "shrink-0 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-white"
              : "shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]"
          }
        >
          {isComplete ? "Completa" : `${percent}%`}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
        <span>{formatMinutes(totalMinutes)}</span>
        <span>·</span>
        <span>{recipe.servings} porç{recipe.servings === 1 ? "ão" : "ões"}</span>
        <span>·</span>
        <span>
          {matchedIngredientIds.length} de{" "}
          {matchedIngredientIds.length + missingIngredientIds.length} ingredientes
        </span>
      </div>

      {missingIngredientIds.length > 0 && (
        <p className="mt-3 text-xs text-[var(--warn)]">
          Falta:{" "}
          {missingIngredientIds
            .map((id) => ingredientNames.get(id) ?? id)
            .join(", ")}
        </p>
      )}
    </Link>
  );
}
