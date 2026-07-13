import Link from "next/link";

type EmptyStateProps = {
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

/** Friendly placeholder for sections whose content list is empty. */
export function EmptyState({ message, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-black/20 bg-surface p-8 text-center">
      <p className="text-surface-foreground/80">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-3 inline-block text-sm font-medium text-brand underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
