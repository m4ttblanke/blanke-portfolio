export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
};

export default function Home() {
  return (
    <div>
      <h1>Matt Blanke</h1>
      <p>CS student and software engineer.</p>
      <ul>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/experience">Experience</a></li>
        <li><a href="/coursework">Coursework</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </div>
  );
}
