import type { Metadata } from "next";
import Image from "next/image";
import { getOfficers } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { RichText } from "@/components/ui/RichText";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Executive Board",
  description: "Meet the IU National Pan-Hellenic Council's executive board.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
}

export default async function ExecBoardPage() {
  const officers = await getOfficers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Executive Board
      </h1>
      <p className="mt-4 max-w-3xl text-foreground/80">
        Photos and bios will appear here once they&rsquo;re added in the CMS.
        Contact info is only ever shown for officers who have explicitly
        approved it for publication.
      </p>

      {officers.length === 0 ? (
        <EmptyState message="Executive board coming soon." />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {officers.map((officer) => (
            <div
              key={officer._id}
              className="rounded-lg border border-black/10 bg-surface p-6 text-center text-surface-foreground shadow-sm"
            >
              {officer.photo ? (
                <Image
                  src={urlFor(officer.photo).width(160).height(160).url()}
                  alt={officer.photo.alt}
                  width={80}
                  height={80}
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-semibold text-brand"
                  aria-hidden="true"
                >
                  {initials(officer.name)}
                </div>
              )}
              <h3 className="mt-4 text-lg font-semibold">{officer.name}</h3>
              <p className="mt-1 text-sm text-surface-foreground/60">
                {officer.position}
              </p>
              {officer.bio ? (
                <RichText
                  value={officer.bio}
                  className="mt-3 text-left text-sm text-surface-foreground/80 [&_p]:mt-2"
                />
              ) : null}
              {officer.approvedForPublication &&
              (officer.email || officer.phone) ? (
                <div className="mt-3 space-y-1 text-sm">
                  {officer.email ? (
                    <a
                      href={`mailto:${officer.email}`}
                      className="block text-brand underline"
                    >
                      {officer.email}
                    </a>
                  ) : null}
                  {officer.phone ? (
                    <p className="text-surface-foreground/70">
                      {officer.phone}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
