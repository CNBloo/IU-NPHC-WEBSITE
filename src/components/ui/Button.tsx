import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const VARIANT_CLASSES = {
  primary: "bg-brand text-brand-foreground hover:opacity-90",
  secondary: "bg-surface text-brand border-2 border-brand hover:bg-brand/5",
  outline:
    "bg-transparent text-brand-foreground border-2 border-brand-foreground hover:bg-white/10",
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASSES;

const baseClasses =
  "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-colors";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
