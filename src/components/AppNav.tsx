"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SiteHeaderBar from "@/components/SiteHeaderBar";
import { useAuth } from "@/providers/AuthProvider";

const links = [
  { href: "/despensa", label: "Despensa" },
  { href: "/cozinhar", label: "Fazer receita" },
  { href: "/receitas", label: "Receitas" },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/entrar");
  }

  return (
    <SiteHeaderBar bordered>
      <div className="flex items-center gap-2 sm:gap-3">
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

        {user && (
          <div className="flex items-center gap-2 border-l border-[var(--line)] pl-2 sm:pl-3">
            <span className="hidden max-w-28 truncate text-xs text-[var(--muted)] sm:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-[var(--secondary)] hover:bg-[var(--accent-soft)]"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </SiteHeaderBar>
  );
}
