# 🍳 Aplicativo: WheRecipe — Front-end

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38BDF8?logo=tailwindcss&logoColor=white)
![Contexto](https://img.shields.io/badge/Contexto-Projeto%20Pessoal-blueviolet)
![Status](https://img.shields.io/badge/Status-Em%20andamento-yellow)

Interface do **WheRecipe**, um aplicativo pessoal para facilitar o dia a dia na cozinha: encontrar receitas com o que você já tem em casa. Este repositório concentra o Front-end, consumindo a API do [Back-end](https://github.com/OndeJoaoGularte/WheRecipe-Backend).

---

## 🎯 Objetivo do Projeto

Oferecer uma experiência simples e prática para cadastrar a despensa, descobrir receitas compatíveis com o que já está em casa e acompanhar o preparo, reduzindo desperdício e a dúvida do “o que cozinhar hoje?”.

---

## 🚀 Funcionalidades

1. **Landing e autenticação:** Apresentação do app, cadastro, login e área logada protegida.
2. **Despensa:** Cadastro e gestão dos itens disponíveis em casa, com quantidades.
3. **Cozinhar com a despensa:** Sugestões de receitas com base no que está salvo, mostrando cobertura e ingredientes faltantes.
4. **Catálogo de receitas:** Exploração do acervo, filtros por tags e abertura do modo de preparo.
5. **Atualização pós-receita:** Fluxo para baixar itens da despensa depois de cozinhar.
6. **Planner da semana:** Tela em evolução para organizar o cardápio semanal.

---

## 🛠️ Tecnologias Utilizadas

* **Next.js 16:** Framework React com App Router para as páginas e a navegação.
* **React 19:** Biblioteca de interface dos fluxos de despensa, receitas e autenticação.
* **TypeScript:** Tipagem dos serviços, hooks e entidades do domínio.
* **TanStack Query:** Cache e sincronização dos dados vindos da API.
* **Tailwind CSS 4:** Estilização utilitária da interface.
* **React Compiler (Babel plugin):** Otimização de renderização no setup do projeto.

---

## 🧠 Conceitos Aplicados

* **App Router do Next.js:** Organização por rotas (`entrar`, `cadastro`, `despensa`, `cozinhar`, `receitas`, `semana`) com layout autenticado.
* **Auth no client:** Provider de autenticação, gate de rotas privadas e integração com os tokens da API.
* **Data fetching com hooks:** Hooks (`usePantry`, `useRecipes`, `useIngredients`) sobre React Query para o domínio da cozinha.
* **UX orientada a decisão:** Cards de match com percentual de cobertura e indicação do que falta para completar a receita.
* **Componentização:** Páginas e painéis reutilizáveis (despensa, catálogo, resultados de match, diálogo pós-receita).
