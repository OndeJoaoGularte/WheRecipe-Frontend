import type { IngredientCategory, IngredientFamily } from "@/types/recipe";

export const ingredientCategories: IngredientCategory[] = [
  { id: "laticinios", name: "Laticínios" },
  { id: "frios", name: "Frios" },
  { id: "carnes", name: "Carnes e ovos" },
  { id: "graos", name: "Grãos e cereais" },
  { id: "massas", name: "Massas e pães" },
  { id: "legumes", name: "Legumes e verduras" },
  { id: "frutas", name: "Frutas" },
  { id: "temperos", name: "Temperos" },
  { id: "oleos", name: "Óleos e gorduras" },
  { id: "mercearia", name: "Mercearia" },
];

export const ingredientFamilies: IngredientFamily[] = [
  { id: "leite", name: "Leite" },
  { id: "queijo", name: "Queijo" },
  { id: "tempero", name: "Tempero" },
  { id: "oleo", name: "Óleo" },
];
