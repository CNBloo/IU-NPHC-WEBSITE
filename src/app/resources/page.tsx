import type { Metadata } from "next";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Resources | IU National Pan-Hellenic Council",
  description:
    "Interest meeting info, FAQs, the intake disclaimer, and campus resources for the IU National Pan-Hellenic Council.",
};

const CAMPUS_RESOURCES = [
  {
    name: "Office of Sorority and Fraternity Life",
    description:
      "Advises all Greek councils at IU, including NPHC, and is the place to report hazing concerns.",
    url: "https://studentlife.indiana.edu/involvement-belonging/sororities-fraternities/about-osfl/index.html",
  },
  {
    name: "Counseling and Psychological Services (CAPS)",
    description:
      "Free counseling for IU students who've paid the student health fee, including a 24/7 crisis line.",
    url: "https://healthcenter.indiana.edu/counseling/index.html",
  },
  {
    name: "IU Office of Student Life",
    description: "The broader hub for student involvement and campus life resources.",
    url: "https://studentlife.indiana.edu",
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Resources
      </h1>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Interested in Joining?</h2>
        <p className="mt-3 text-foreground/80">
          Each Divine Nine organization runs its own membership intake process
          independently. If you&rsquo;re interested in a specific organization,
          visit its page on{" "}
          <a href="/organizations" className="text-brand underline">
            Member Organizations
          </a>{" "}
          for a link to its official national website, and watch the{" "}
          <a href="/events" className="text-brand underline">
            Events
          </a>{" "}
          page for interest meeting announcements.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-black/10 bg-surface p-6 text-surface-foreground">
        <h2 className="text-xl font-semibold">Intake Disclaimer</h2>
        <p className="mt-3 text-surface-foreground/80">
          The IU National Pan-Hellenic Council does not conduct membership
          intake itself — each member organization sets its own eligibility
          requirements, process, and timeline through its national
          headquarters. Every member organization and Indiana University
          maintain zero-tolerance anti-hazing policies. Report hazing
          concerns to the Office of Sorority and Fraternity Life or IU&rsquo;s
          Dean of Students Office.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-black/10 bg-surface p-4 text-surface-foreground"
            >
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-center justify-between gap-3">
                  {faq.question}
                  <span
                    className="shrink-0 text-surface-foreground/50 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-surface-foreground/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Campus Resources</h2>
        <ul className="mt-4 space-y-4">
          {CAMPUS_RESOURCES.map((resource) => (
            <li
              key={resource.name}
              className="rounded-lg border border-black/10 bg-surface p-4 text-surface-foreground"
            >
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline"
              >
                {resource.name} ↗
              </a>
              <p className="mt-1 text-sm text-surface-foreground/70">
                {resource.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
