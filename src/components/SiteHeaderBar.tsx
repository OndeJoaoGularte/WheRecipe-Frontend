import type { ReactNode } from "react";
import BrandMark from "@/components/BrandMark";

type SiteHeaderBarProps = {
  children?: ReactNode;
  /** App shell uses a visible divider; landing keeps the same 1px slot transparent. */
  bordered?: boolean;
  className?: string;
};

/**
 * Shared top bar so the brand sits on the same grid on landing and in-app.
 */
export default function SiteHeaderBar({
  children,
  bordered = false,
  className = "",
}: SiteHeaderBarProps) {
  return (
    <header
      className={`shrink-0 border-b ${
        bordered
          ? "border-[var(--line)] bg-white/70 backdrop-blur-sm"
          : "border-transparent"
      } ${className}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark href="/" size="sm" className="shrink-0" />
        {children}
      </div>
    </header>
  );
}
