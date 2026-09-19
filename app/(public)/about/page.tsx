export const metadata = {
  title: "About — Matt Blanke",
  description: "About Matt Blanke.",
  alternates: { canonical: "/about" },
};

// Deliberately minimal until real profile content exists. The previous
// placeholder bio made unverified claims about experience, so it was removed
// rather than rewritten.
export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>

      <section>
        <h2>Contact</h2>
        <ul>
          <li>
            Email:{" "}
            <a href="mailto:mattheweblanke@gmail.com">mattheweblanke@gmail.com</a>
          </li>
          <li>
            GitHub:{" "}
            <a href="https://github.com/m4ttblanke" target="_blank" rel="noopener noreferrer">
              @m4ttblanke
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a href="https://linkedin.com/in/m4ttblanke" target="_blank" rel="noopener noreferrer">
              @m4ttblanke
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
