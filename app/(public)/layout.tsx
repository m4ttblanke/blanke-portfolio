import { Nav } from "@/components/nav";
import { BinaryRain } from "@/components/binary-rain";
import { HackerIntro } from "@/components/hacker-intro";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HackerIntro />
      <BinaryRain />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fg focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
      <Nav />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {children}
      </main>
    </>
  );
}
