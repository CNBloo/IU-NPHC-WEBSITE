import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About NPHC | IU National Pan-Hellenic Council",
  description:
    "Learn about the National Pan-Hellenic Council, its history at Indiana University Bloomington, and the values its member organizations share.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        About NPHC
      </h1>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">What is NPHC?</h2>
        <p className="mt-3 text-foreground/80">
          The National Pan-Hellenic Council, Incorporated (NPHC) is an
          umbrella organization for nine historically Black international
          Greek-letter sororities and fraternities, collectively known as the
          &ldquo;Divine Nine.&rdquo; Founded in 1930, NPHC promotes
          interaction through forums, meetings, and other mediums for the
          exchange of information, and engages in cooperative programming
          and civic action.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">NPHC at Indiana University</h2>
        <p className="mt-3 text-foreground/80">
          Indiana University Bloomington has a unique connection to NPHC: in
          1992, IU and the National Board of Directors of NPHC established
          the council&rsquo;s first permanent national office right here on
          campus in Bloomington. The IU chapter of the National Pan-Hellenic
          Council carries that legacy forward, supporting the Divine Nine
          chapters active at IU today through the Office of Sorority and
          Fraternity Life.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Our Purpose &amp; Values</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-foreground/80">
          <li>
            <span className="font-medium text-foreground">Scholarship</span>{" "}
            &mdash; supporting academic excellence among member chapters.
          </li>
          <li>
            <span className="font-medium text-foreground">Service</span>{" "}
            &mdash; giving back to the Bloomington and IU communities.
          </li>
          <li>
            <span className="font-medium text-foreground">Unity</span>{" "}
            &mdash; fostering cooperation and communication across chapters.
          </li>
          <li>
            <span className="font-medium text-foreground">Leadership</span>{" "}
            &mdash; developing the next generation of student leaders.
          </li>
        </ul>
      </section>
    </div>
  );
}
