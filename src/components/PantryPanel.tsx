"use client";

import { useMemo, useState } from "react";
import { groupIngredientsByCategory } from "@/lib/ingredients";
import type { Ingredient, IngredientCategory } from "@/types/recipe";
import type { PantryItem } from "@/types/pantry";

type PantryPanelProps = {
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  items: PantryItem[];
  onUpsert: (item: PantryItem) => void;
  onRemove: (ingredientId: string) => void;
  isSaving?: boolean;
};

export default function PantryPanel({
  ingredients,
  categories,
  items,
  onUpsert,
  onRemove,
  isSaving = false,
}: PantryPanelProps) {
  const [search, setSearch] = useState("");
  const [draftQuantity, setDraftQuantity] = useState("1 unidade");
  const [selectedToAdd, setSelectedToAdd] = useState<string | null>(null);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState("");

  const byId = useMemo(
    () => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
    [ingredients],
  );

  const pantryIds = useMemo(
    () => new Set(items.map((item) => item.ingredientId)),
    [items],
  );

  const available = useMemo(
    () => ingredients.filter((ingredient) => !pantryIds.has(ingredient.id)),
    [ingredients, pantryIds],
  );

  const groupedAvailable = useMemo(
    () => groupIngredientsByCategory(available, categories, search),
    [available, categories, search],
  );

  const isSearching = search.trim().length > 0;
  const selectedName = selectedToAdd
    ? (byId.get(selectedToAdd)?.name ?? selectedToAdd)
    : null;

  function toggleCategory(id: string) {
    setOpenCategoryIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function startEdit(item: PantryItem) {
    setEditingId(item.ingredientId);
    setEditingQuantity(item.quantity);
  }

  function saveEdit() {
    if (!editingId) return;
    const quantity = editingQuantity.trim();
    if (!quantity) {
      onRemove(editingId);
    } else {
      onUpsert({ ingredientId: editingId, quantity });
    }
    setEditingId(null);
    setEditingQuantity("");
  }

  function addSelected() {
    if (!selectedToAdd) return;
    const quantity = draftQuantity.trim() || "a gosto";
    onUpsert({ ingredientId: selectedToAdd, quantity });
    setSelectedToAdd(null);
    setDraftQuantity("1 unidade");
    setSearch("");
  }

  return (
    <section
      className="grid h-full min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]"
      aria-labelledby="pantry-heading"
    >
      <h2 id="pantry-heading" className="sr-only">
        Gerenciar despensa
      </h2>

      {/* Esquerda: opções para adicionar */}
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/80">
        <div className="shrink-0 space-y-3 border-b border-[var(--line)] p-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
              Opções
            </h3>
            <p className="text-sm text-[var(--muted)]">
              Escolha um item, informe a quantidade e adicione.
            </p>
          </div>

          <label className="block">
            <span className="sr-only">Buscar ingredientes</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar ingrediente ou categoria..."
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[var(--muted)]">
              Quantidade
            </span>
            <input
              value={draftQuantity}
              onChange={(event) => setDraftQuantity(event.target.value)}
              placeholder="Ex.: 1 pacote, 1/2 xícara, 2 unidades"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          {selectedName && (
            <p className="text-sm text-[var(--secondary)]">
              Selecionado: <span className="font-semibold">{selectedName}</span>
            </p>
          )}

          <button
            type="button"
            onClick={addSelected}
            disabled={!selectedToAdd || isSaving}
            className="w-full rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-50"
          >
            Adicionar à despensa
          </button>
        </div>

        <div className="h-0 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-4">
          {groupedAvailable.map(({ category, ingredients: categoryItems }) => {
            const isOpen =
              isSearching || openCategoryIds.includes(category.id);

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--background)]/60"
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
                    <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-strong)]">
                      {categoryItems.length}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`text-[var(--muted)] transition ${isOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </span>
                </button>

                {isOpen && (
                  <div className="space-y-1.5 border-t border-[var(--line)] px-3 py-3">
                    {categoryItems.map((ingredient) => {
                      const isSelected = selectedToAdd === ingredient.id;

                      return (
                        <button
                          key={ingredient.id}
                          type="button"
                          onClick={() => setSelectedToAdd(ingredient.id)}
                          aria-pressed={isSelected}
                          className={
                            isSelected
                              ? "w-full rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2.5 text-left text-sm font-medium text-[var(--accent-strong)]"
                              : "w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-left text-sm text-[var(--ink)] transition hover:border-[var(--accent)]"
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

          {groupedAvailable.length === 0 && (
            <p className="text-sm text-[var(--muted)]">
              {isSearching
                ? `Nenhum ingrediente encontrado para “${search.trim()}”.`
                : "Todos os ingredientes já estão na despensa."}
            </p>
          )}
        </div>
      </div>

      {/* Direita: itens salvos */}
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white/80">
        <div className="shrink-0 border-b border-[var(--line)] p-4">
          <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
            Na despensa
          </h3>
          <p className="text-sm text-[var(--muted)]">
            {items.length === 0
              ? "Ainda vazio — adicione itens à esquerda."
              : `${items.length} ${items.length === 1 ? "item salvo" : "itens salvos"}.`}
          </p>
        </div>

        <div className="h-0 min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {items.length === 0 ? (
            <div className="flex h-full min-h-40 items-center justify-center rounded-xl border border-dashed border-[var(--line)] px-4 text-center">
              <p className="text-sm text-[var(--muted)]">
                Seus itens aparecem aqui depois de adicionar.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => {
                const name =
                  byId.get(item.ingredientId)?.name ?? item.ingredientId;
                const isEditing = editingId === item.ingredientId;

                return (
                  <li
                    key={item.ingredientId}
                    className="rounded-xl border border-[var(--line)] bg-[var(--background)]/60 px-3 py-2.5"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {name}
                        </p>
                        <input
                          value={editingQuantity}
                          onChange={(event) =>
                            setEditingQuantity(event.target.value)
                          }
                          placeholder="Ex.: 1/2 pacote"
                          className="w-full rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={isSaving}
                            className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--ink)]">
                            {name}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-full px-2 py-1 text-xs font-medium text-[var(--secondary)] hover:bg-[var(--accent-soft)]"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(item.ingredientId)}
                            className="rounded-full px-2 py-1 text-xs font-medium text-[var(--warn)] hover:bg-[var(--accent-soft)]"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
