import type { Metadata } from "next";
import { OFFICERS } from "@/data/officers";

export const metadata: Metadata = {
  title: "Executive Board | IU National Pan-Hellenic Council",
  description: "Meet the IU National Pan-Hellenic Council's executive board.",
};

export default function ExecBoardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Executive Board
      </h1>
      <p className="mt-4 max-w-3xl text-foreground/80">
        Board member names, photos, and bios will appear here once they&rsquo;re
        added in the CMS. Contact info is only ever shown for officers who
        have explicitly approved it for publication.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {OFFICERS.map((officer) => (
          <div
            key={officer.position}
            className="rounded-lg border border-black/10 bg-surface p-6 text-center text-surface-foreground shadow-sm"
          >
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-semibold text-brand"
              aria-hidden="true"
            >
              {officer.position
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{officer.position}</h3>
            <p className="mt-1 text-sm text-surface-foreground/60">
              To be announced
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
