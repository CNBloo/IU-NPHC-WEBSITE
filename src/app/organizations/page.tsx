import type { Metadata } from "next";
import { ORGANIZATIONS } from "@/data/organizations";
import { OrgCard } from "@/components/ui/OrgCard";

export const metadata: Metadata = {
  title: "Member Organizations",
  description:
    "The Divine Nine chapters of the IU National Pan-Hellenic Council at Indiana University Bloomington.",
};

export default function OrganizationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Member Organizations
      </h1>
      <p className="mt-4 max-w-3xl text-foreground/80">
        The IU National Pan-Hellenic Council is made up of chapters from the
        &ldquo;Divine Nine&rdquo; &mdash; the nine historically Black
        international Greek-letter sororities and fraternities. Below are the
        chapters currently active at Indiana University Bloomington, plus
        Kappa Alpha Psi&rsquo;s Alpha chapter, which is temporarily inactive.
        Kappa Alpha Psi holds a special place in this campus&rsquo;s history:
        it was founded right here at IU in 1911.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ORGANIZATIONS.map((org) => (
          <OrgCard key={org.slug} org={org} />
        ))}
      </div>
    </div>
  );
}
