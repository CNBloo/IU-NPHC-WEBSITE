"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About NPHC" },
  { href: "/organizations", label: "Member Organizations" },
  { href: "/exec-board", label: "Executive Board" },
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="bg-brand text-brand-foreground"
      onKeyDown={(event) => {
        // Escape closes the mobile menu and hands focus back to the toggle,
        // so keyboard users aren't stranded in a closed menu.
        if (event.key === "Escape" && isMenuOpen) {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          IU National Pan-Hellenic Council
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className="rounded-md p-2 sm:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Only one of the two Primary navs is ever in the accessibility
            tree: this one is display:none below sm, and the mobile one is
            only rendered while open (and hidden at sm and up). */}
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Primary"
          className="border-t border-white/20 sm:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 py-3 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-2 py-2 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
