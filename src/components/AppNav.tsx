"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SiteHeaderBar from "@/components/SiteHeaderBar";
import { useAuth } from "@/providers/AuthProvider";

const links = [
  { href: "/despensa", label: "Despensa", shortLabel: "Despensa" },
  { href: "/cozinhar", label: "Fazer receita", shortLabel: "Cozinhar" },
  { href: "/receitas", label: "Receitas", shortLabel: "Receitas" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/entrar");
  }

  return (
    <>
      <SiteHeaderBar bordered>
        {/* Desktop: full nav in the top bar */}
        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-2" aria-label="Principal">
            {links.map((link) => {
              const isActive = isActivePath(pathname, link.href);

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

          {user && (
            <div className="flex items-center gap-2 border-l border-[var(--line)] pl-3">
              <span className="max-w-28 truncate text-xs text-[var(--muted)]">
                {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-2.5 py-1.5 text-xs font-medium text-[var(--secondary)] hover:bg-[var(--accent-soft)]"
              >
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Mobile: only logout in the top bar; tabs live at the bottom */}
        <div className="flex items-center md:hidden">
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-10 rounded-full px-3 py-2 text-sm font-medium text-[var(--secondary)] hover:bg-[var(--accent-soft)]"
            >
              Sair
            </button>
          )}
        </div>
      </SiteHeaderBar>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        aria-label="Principal"
      >
        <div className="mx-auto grid h-14 max-w-lg grid-cols-3">
          {links.map((link) => {
            const isActive = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[var(--accent)]"
                    : "flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[var(--muted)]"
                }
              >
                <span
                  className={
                    isActive
                      ? "h-1 w-8 rounded-full bg-[var(--accent)]"
                      : "h-1 w-8 rounded-full bg-transparent"
                  }
                  aria-hidden
                />
                {link.shortLabel}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
