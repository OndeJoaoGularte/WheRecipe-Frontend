import Image from "next/image";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const steps = [
  {
    title: "Crie sua conta",
    text: "Assim a despensa fica salva e acompanha o que você realmente tem em casa.",
  },
  {
    title: "Cadastre o que tem",
    text: "Informe os itens e as quantidades aproximadas — 1 pacote, 1/2 xícara, o que fizer sentido.",
  },
  {
    title: "Faça a receita",
    text: "Clique em Fazer receita, escolha um prato e, se quiser, atualize a despensa depois.",
  },
];

const features = [
  {
    href: "/despensa",
    title: "Despensa",
    text: "Cadastre e salve os itens que você tem em casa, com quantidade.",
  },
  {
    href: "/cozinhar",
    title: "Fazer receita",
    text: "Veja sugestões baseadas só no que já está salvo na despensa.",
  },
  {
    href: "/receitas",
    title: "Receitas",
    text: "Explore o catálogo, abra o modo de preparo e baixe itens com calma.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <BrandMark href="/" size="sm" />
        <div className="flex items-center gap-2">
          <Link
            href="/entrar"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--secondary)] transition hover:bg-[var(--accent-soft)]"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <Image
          src="/brand/logo-mark.png"
          alt="WheRecipe"
          width={112}
          height={112}
          className="rounded-3xl shadow-[0_16px_40px_rgba(74,84,137,0.28)]"
          priority
        />
        <p className="mt-6 font-display text-4xl font-bold tracking-tight text-[var(--secondary)] sm:text-5xl">
          WheRecipe
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-[var(--ink)] sm:text-3xl">
          Cozinhe com o que já tem em casa.
        </h1>
        <p className="mt-4 max-w-xl text-base text-[var(--muted)] sm:text-lg">
          Cadastre sua despensa, descubra receitas e atualize os itens com
          calma — nada desaparece sem a sua confirmação.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(244,121,32,0.28)] transition hover:bg-[var(--accent-strong)]"
          >
            Começar agora
          </Link>
          <Link
            href="/entrar"
            className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3.5 text-base font-semibold text-[var(--secondary)] transition hover:border-[var(--accent)]"
          >
            Já tenho conta
          </Link>
        </div>
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
          Três passos simples para o dia a dia.
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
          No MVP
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Conta, despensa com quantidades e receitas com modo de preparo.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href="/entrar"
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
