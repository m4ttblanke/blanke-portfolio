import { ContentFrame, PageFrame, PageHeader } from "@/components/shell/page";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "About — Matt Blanke",
  description: "About Matthew Blanke.",
  alternates: { canonical: "/about" },
};

// Deliberately minimal until real profile content exists (File 001). The
// previous placeholder bio made unverified claims about experience, so it was
// removed rather than rewritten.
export default function AboutPage() {
  return (
    <PageFrame>
      <PageHeader section="file" title="About" />
      <ContentFrame>
        <section>
          <h2>Contact</h2>
          <ul>
            <li>
              Email: <a href={CONTACT.email.href}>{CONTACT.email.label}</a>
            </li>
            <li>
              GitHub:{" "}
              <a href={CONTACT.github.href} target="_blank" rel="noopener noreferrer">
                {CONTACT.github.label}
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a href={CONTACT.linkedin.href} target="_blank" rel="noopener noreferrer">
                {CONTACT.linkedin.label}
              </a>
            </li>
          </ul>
        </section>
      </ContentFrame>
    </PageFrame>
  );
}
