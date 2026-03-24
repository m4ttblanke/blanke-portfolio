export const metadata = {
  title: "About — Matt Blanke",
  description: "About Matt Blanke.",
};

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-fg">About</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Bio</h2>
        {/* TODO: Update with your actual bio and background */}
        <p className="text-fg-muted leading-relaxed">
          I'm a computer science student with a passion for building products that
          make a difference. I've worked on full-stack applications, infrastructure
          projects, and open-source contributions.
        </p>
        <p className="text-fg-muted leading-relaxed">
          When I'm not coding, you can find me reading about systems design,
          exploring new technologies, or contributing to the developer community.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-fg">Contact</h2>
        <ul className="space-y-2">
          <li>
            <span className="text-fg-muted">Email: </span>
            <a
              href="mailto:mattheweblanke@gmail.com"
              className="text-fg hover:underline transition-colors duration-150"
            >
              mattheweblanke@gmail.com
            </a>
          </li>
          <li>
            <span className="text-fg-muted">GitHub: </span>
            <a
              href="https://github.com/m4ttblanke"
              className="text-fg hover:underline transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              @m4ttblanke
            </a>
          </li>
          <li>
            <span className="text-fg-muted">LinkedIn: </span>
            <a
              href="https://linkedin.com/in/m4ttblanke"
              className="text-fg hover:underline transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              @m4ttblanke
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
