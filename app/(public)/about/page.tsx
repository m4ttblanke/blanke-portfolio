export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">About</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Bio</h2>
        <p className="text-zinc-600 leading-relaxed">
          I'm a computer science student with a passion for building products that
          make a difference. I've worked on full-stack applications, infrastructure
          projects, and open-source contributions.
        </p>
        <p className="text-zinc-600 leading-relaxed">
          When I'm not coding, you can find me reading about systems design,
          exploring new technologies, or contributing to the developer community.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Contact</h2>
        <ul className="space-y-2">
          <li>
            <span className="text-zinc-600">Email: </span>
            <a
              href="mailto:matt@example.com"
              className="text-zinc-900 hover:underline"
            >
              matt@example.com
            </a>
          </li>
          <li>
            <span className="text-zinc-600">GitHub: </span>
            <a
              href="https://github.com/matthewblanke"
              className="text-zinc-900 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @matthewblanke
            </a>
          </li>
          <li>
            <span className="text-zinc-600">LinkedIn: </span>
            <a
              href="https://linkedin.com/in/matthewblanke"
              className="text-zinc-900 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @matthewblanke
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
