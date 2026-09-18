import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <Link href="/">Home</Link> |{" "}
        <Link href="/projects">Projects</Link> |{" "}
        <Link href="/experience">Experience</Link> |{" "}
        <Link href="/coursework">Coursework</Link> |{" "}
        <Link href="/about">About</Link> |{" "}
        {/* Plain anchor on purpose: /admin is behind sign-in, so it must not be prefetched. */}
        <a href="/admin">Sign in</a>
      </nav>
      <hr />
      <main id="main-content">
        {children}
      </main>
    </>
  );
}
