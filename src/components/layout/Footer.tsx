export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-black/10 bg-surface text-surface-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm sm:px-6">
        <p className="font-semibold">IU National Pan-Hellenic Council</p>
        <p className="mt-1 text-surface-foreground/70">
          Indiana University Bloomington
        </p>
        <p className="mt-4 text-surface-foreground/70">
          &copy; {year} IU National Pan-Hellenic Council. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
