export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900">Matt Blanke</h1>
        <p className="text-lg text-zinc-600">
          CS student and software engineer from Chicago.
        </p>
        <p className="text-zinc-600 leading-relaxed">
          I build full-stack applications with a focus on clean architecture, user
          experience, and deployment practices. Currently exploring real-time systems,
          database design, and the intersection of developer experience and product.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="/projects"
              className="text-zinc-600 hover:text-zinc-900 underline"
            >
              Projects
            </a>
            <span className="text-zinc-400"> — Featured work and experiments</span>
          </li>
          <li>
            <a
              href="/experience"
              className="text-zinc-600 hover:text-zinc-900 underline"
            >
              Experience
            </a>
            <span className="text-zinc-400"> — Professional roles and internships</span>
          </li>
          <li>
            <a
              href="/coursework"
              className="text-zinc-600 hover:text-zinc-900 underline"
            >
              Coursework
            </a>
            <span className="text-zinc-400"> — Academic projects and learning</span>
          </li>
          <li>
            <a
              href="/about"
              className="text-zinc-600 hover:text-zinc-900 underline"
            >
              About
            </a>
            <span className="text-zinc-400"> — Bio and contact information</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
