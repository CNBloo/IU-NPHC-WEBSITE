import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IU National Pan-Hellenic Council",
    template: "%s | IU National Pan-Hellenic Council",
  },
  description:
    "The IU National Pan-Hellenic Council unites the Divine Nine chapters at Indiana University Bloomington.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "IU National Pan-Hellenic Council",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render every page at request time: the nonce-based CSP in src/proxy.ts
  // requires it. Statically prerendered HTML carries no nonce, and with
  // 'strict-dynamic' the 'self' fallback is ignored, so every script load
  // on a static page gets blocked and React never hydrates (verified by the
  // e2e console assertions). Sanity fetches still cache with tags, so
  // publish-to-live revalidation is unaffected.
  await connection();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
