import { ContentFrame, PageFrame, PageHeader } from "@/components/shell/page";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Contact — Matt Blanke",
  description: "How to reach Matthew Blanke.",
  alternates: { canonical: "/contact" },
};

// A plain list of verified contact points. Its own route so Contact is a
// stable destination once About becomes File 001.
export default function ContactPage() {
  return (
    <PageFrame>
      <PageHeader section="contact" title="Contact" />
      <ContentFrame>
        <ul>
          <li>
            Email: <a href={CONTACT.email.href}>{CONTACT.email.label}</a>
          </li>
          <li>
            GitHub:{" "}
            <a href={CONTACT.github.href} target="_blank" rel="noopener noreferrer">
              {CONTACT.github.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a href={CONTACT.linkedin.href} target="_blank" rel="noopener noreferrer">
              {CONTACT.linkedin.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </ContentFrame>
    </PageFrame>
  );
}
