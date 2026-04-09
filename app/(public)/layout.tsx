export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <a href="/">Home</a> |{" "}
        <a href="/projects">Projects</a> |{" "}
        <a href="/experience">Experience</a> |{" "}
        <a href="/coursework">Coursework</a> |{" "}
        <a href="/about">About</a>
      </nav>
      <hr />
      <main id="main-content">
        {children}
      </main>
    </>
  );
}
