"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/despensa", label: "Despensa" },
  { href: "/receitas", label: "Receitas" },
  { href: "/semana", label: "Semana" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <header className="shrink-0 border-b border-[var(--line)] bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-[var(--secondary)] sm:text-2xl"
        >
          WheRecipe
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "rounded-full bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white"
                    : "rounded-full px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
