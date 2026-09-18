import Link from "next/link";

export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div>
      <h1>Matt Blanke</h1>
      <p>CS student and software engineer.</p>
      <ul>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/experience">Experience</Link></li>
        <li><Link href="/coursework">Coursework</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><a href="/admin">Admin</a></li>
      </ul>
    </div>
  );
}
