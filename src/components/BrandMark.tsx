import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  /** `transparent` = pin solto; `mark` = versão com fundo roxo */
  variant?: "transparent" | "mark";
  className?: string;
};

const sizes = {
  sm: { box: 28, text: "text-xl" },
  md: { box: 36, text: "text-2xl" },
  lg: { box: 88, text: "text-4xl" },
} as const;

export default function BrandMark({
  href = "/",
  size = "md",
  showWordmark = true,
  variant = "transparent",
  className = "",
}: BrandMarkProps) {
  const { box, text } = sizes[size];
  const src = variant === "mark" ? "/brand/logo-mark.png" : "/brand/logo.png";
  const rounded = variant === "mark" ? "rounded-2xl" : "";

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={`relative shrink-0 overflow-hidden ${rounded}`}
        style={{ width: box, height: box }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={`${box}px`}
          className="object-contain"
          priority
        />
      </span>
      {showWordmark ? (
        <span
          className={`font-display font-bold tracking-tight text-[var(--secondary)] ${text}`}
        >
          WheRecipe
        </span>
      ) : (
        <span className="sr-only">WheRecipe</span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center no-underline">
      {content}
    </Link>
  );
}
