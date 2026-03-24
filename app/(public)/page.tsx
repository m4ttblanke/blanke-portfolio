export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
};

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-fg">Matt Blanke</h1>
        <p className="text-lg text-fg-muted">
          CS student and software engineer from California.
        </p>
        <p className="text-fg-muted leading-relaxed">
          I build full-stack applications with a focus on clean architecture, user
          experience, and deployment practices. Currently exploring real-time systems,
          database design, and the intersection of developer experience and product.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="/projects"
              className="text-fg-muted hover:text-fg underline transition-colors duration-150"
            >
              Projects
            </a>
            <span className="text-fg-subtle"> — Featured work and experiments</span>
          </li>
          <li>
            <a
              href="/experience"
              className="text-fg-muted hover:text-fg underline transition-colors duration-150"
            >
              Experience
            </a>
            <span className="text-fg-subtle"> — Professional roles and internships</span>
          </li>
          <li>
            <a
              href="/coursework"
              className="text-fg-muted hover:text-fg underline transition-colors duration-150"
            >
              Coursework
            </a>
            <span className="text-fg-subtle"> — Academic projects and learning</span>
          </li>
          <li>
            <a
              href="/about"
              className="text-fg-muted hover:text-fg underline transition-colors duration-150"
            >
              About
            </a>
            <span className="text-fg-subtle"> — Bio and contact information</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
