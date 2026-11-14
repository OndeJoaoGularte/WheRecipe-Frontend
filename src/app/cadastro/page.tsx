import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function CadastroPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--muted)]">
          Carregando...
        </div>
      }
    >
      <AuthForm mode="register" />
    </Suspense>
  );
}
