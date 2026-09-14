import type { Ingredient } from "@/types/recipe";

export const mockIngredients: Ingredient[] = [
  {
    id: "leite-integral",
    name: "Leite integral",
    category: "laticinios",
    family: "leite",
    aliases: ["leite"],
  },
  {
    id: "leite-semidesnatado",
    name: "Leite semidesnatado",
    category: "laticinios",
    family: "leite",
  },
  {
    id: "leite-desnatado",
    name: "Leite desnatado",
    category: "laticinios",
    family: "leite",
  },
  {
    id: "leite-vegetal",
    name: "Leite vegetal",
    category: "laticinios",
    family: "leite",
    aliases: ["leite de amêndoa", "leite de soja", "leite de aveia", "leite de coco"],
  },
  { id: "requeijao", name: "Requeijão", category: "laticinios" },
  {
    id: "queijo-mussarela",
    name: "Mussarela",
    category: "laticinios",
    family: "queijo",
    aliases: ["queijo", "muçarela"],
  },
  {
    id: "queijo-parmesao",
    name: "Parmesão",
    category: "laticinios",
    family: "queijo",
    aliases: ["queijo"],
  },
  { id: "manteiga", name: "Manteiga", category: "laticinios", aliases: ["margarina"] },

  { id: "presunto", name: "Presunto", category: "frios" },

  { id: "frango", name: "Frango", category: "carnes", aliases: ["peito de frango"] },
  { id: "ovo", name: "Ovo", category: "carnes", aliases: ["ovos"] },

  { id: "arroz", name: "Arroz", category: "graos" },
  { id: "feijao", name: "Feijão", category: "graos" },
  { id: "aveia", name: "Aveia", category: "graos" },
  {
    id: "farinha",
    name: "Farinha de trigo",
    category: "graos",
    aliases: ["farinha"],
  },

  {
    id: "massa",
    name: "Massa",
    category: "massas",
    aliases: ["macarrão", "espaguete", "penne"],
  },
  { id: "pao", name: "Pão", category: "massas" },

  { id: "batata", name: "Batata", category: "legumes", aliases: ["batatas"] },
  { id: "cebola", name: "Cebola", category: "legumes" },
  { id: "tomate", name: "Tomate", category: "legumes" },
  { id: "alho", name: "Alho", category: "legumes" },

  { id: "banana", name: "Banana", category: "frutas" },

  { id: "sal", name: "Sal", category: "temperos" },
  {
    id: "pimenta",
    name: "Pimenta",
    category: "temperos",
    family: "tempero",
  },
  {
    id: "manjericao",
    name: "Manjericão",
    category: "temperos",
    family: "tempero",
  },
  {
    id: "tempero-verde",
    name: "Tempero verde",
    category: "temperos",
    family: "tempero",
    aliases: ["cheiro-verde", "salsa", "salsinha"],
  },
  {
    id: "cebolinha",
    name: "Cebolinha",
    category: "temperos",
    family: "tempero",
  },
  {
    id: "oregano",
    name: "Orégano",
    category: "temperos",
    family: "tempero",
  },
  { id: "canela", name: "Canela", category: "temperos" },

  {
    id: "oleo-soja",
    name: "Óleo",
    category: "oleos",
    family: "oleo",
    aliases: ["óleo de soja", "óleo de girassol"],
  },
  {
    id: "azeite",
    name: "Azeite",
    category: "oleos",
    family: "oleo",
  },

  {
    id: "molho-tomate",
    name: "Molho de tomate",
    category: "mercearia",
    aliases: ["molho"],
  },
  { id: "acucar", name: "Açúcar", category: "mercearia" },
];
