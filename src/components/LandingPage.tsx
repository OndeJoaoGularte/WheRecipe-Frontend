import Link from "next/link";

const steps = [
  {
    title: "Diga o que tem",
    text: "Marque os ingredientes da geladeira e da despensa, sem precisar inventar o jantar do zero.",
  },
  {
    title: "Veja o que dá para fazer",
    text: "O WheRecipe sugere receitas com o que você já tem e mostra o que ainda falta, se faltar.",
  },
  {
    title: "Cozinhe no seu ritmo",
    text: "Abra o modo de preparo, ajuste a ideia para a semana e, no futuro, gere a lista do rancho.",
  },
];

const features = [
  {
    href: "/despensa",
    title: "Despensa",
    text: "A função principal: receitas a partir dos ingredientes que você tem em casa.",
  },
  {
    href: "/receitas",
    title: "Receitas",
    text: "Procure um prato específico quando você já sabe o que quer cozinhar.",
  },
  {
    href: "/semana",
    title: "Semana",
    text: "Monte o cardápio dos próximos dias e veja a lista de compras do rancho.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <p className="font-display text-2xl font-bold tracking-tight text-[var(--secondary)]">
          WheRecipe
        </p>
        <Link
          href="/despensa"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          Entrar
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="font-display text-sm font-semibold tracking-wide text-[var(--accent)]">
          Where + Recipe = WheRecipe
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[var(--secondary)] sm:text-6xl">
          Cozinhe com o que já tem em casa.
        </h1>
        <p className="mt-5 max-w-xl text-base text-[var(--muted)] sm:text-lg">
          Sem ideia para o almoço e sem vontade de ir ao mercado? Diga o que tem
          na despensa e receba opções práticas, com porções e nutrição no detalhe.
        </p>
        <Link
          href="/despensa"
          className="mt-10 rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] transition hover:bg-[var(--accent-strong)]"
        >
          Começar a usar
        </Link>
        <a
          href="#como-funciona"
          className="mt-4 text-sm font-medium text-[var(--secondary)] underline-offset-4 hover:underline"
        >
          Como funciona
        </a>
      </section>

      <section
        id="como-funciona"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
          Como funciona
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Três passos simples, pensados para o dia a dia — não para um caderno de
          chef.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[var(--line)] bg-white/70 p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--highlight)] text-sm font-bold text-[var(--ink)]">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
          O que você encontra no app
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          A despensa é o coração. As outras telas existem para quando você já
          sabe o prato ou quer se organizar na semana.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 transition hover:border-[var(--accent)] hover:bg-white"
            >
              <h3 className="font-display text-xl font-semibold text-[var(--secondary)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {feature.text}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
