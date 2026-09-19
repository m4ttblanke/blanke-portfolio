import Link from "next/link";

// M1 applies the visual foundation to these barebones pages without designing
// them: a skip link, a framed <main> with the reading styles, and a legible nav.
// The real shell (navigation, colophon) is a later milestone.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav aria-label="Primary" className="page-frame t-small rule-b">
        <Link href="/">Home</Link> |{" "}
        <Link href="/projects">Projects</Link> |{" "}
        <Link href="/experience">Experience</Link> |{" "}
        <Link href="/coursework">Coursework</Link> |{" "}
        <Link href="/about">About</Link> |{" "}
        {/* Plain anchor on purpose: /admin is behind sign-in, so it must not be prefetched. */}
        <a href="/admin">Sign in</a>
      </nav>
      <main id="main-content" className="page-frame">
        <div className="copy">{children}</div>
      </main>
    </>
  );
}
