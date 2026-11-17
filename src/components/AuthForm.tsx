"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import BrandMark from "@/components/BrandMark";
import { useAuth } from "@/providers/AuthProvider";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { user, isLoading, login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/despensa";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(next);
    }
  }, [isLoading, user, router, next]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <BrandMark href="/" size="md" />

      <h1 className="mt-8 font-display text-2xl font-bold text-[var(--ink)] sm:text-3xl">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {mode === "login"
          ? "Acesse sua despensa e continue de onde parou."
          : "Cadastre-se para guardar os itens da sua despensa."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "register" && (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--ink)]">Nome</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-base text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--ink)]">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-base text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--ink)]">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={4}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-base text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {isSubmitting
            ? "Aguarde..."
            : mode === "login"
              ? "Entrar"
              : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        {mode === "login" ? (
          <>
            Ainda não tem conta?{" "}
            <Link
              href={`/cadastro?next=${encodeURIComponent(next)}`}
              className="font-medium text-[var(--secondary)] underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <Link
              href={`/entrar?next=${encodeURIComponent(next)}`}
              className="font-medium text-[var(--secondary)] underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
