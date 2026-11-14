export type PantryItem = {
  ingredientId: string;
  /** Texto livre: "1 pacote", "1/2 xícara", "2 unidades"... */
  quantity: string;
};

export type PantryUpdate = {
  ingredientId: string;
  /** `null` remove o item da despensa */
  quantity: string | null;
};

export type ConsumptionDraftItem = {
  ingredientId: string;
  recipeQuantity: string;
  currentQuantity: string;
  /** Se false, o item não entra na baixa */
  include: boolean;
  /** Vazio = remover da despensa; preenchido = nova quantidade restante */
  remainingQuantity: string;
};
