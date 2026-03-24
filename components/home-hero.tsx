'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function BinaryBackground() {
  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 text-accent font-mono text-xs whitespace-pre opacity-20 animate-pulse">
        {`1010 1100 1001
0110 1010 0011
1001 0101 1100`}
      </div>
    </div>
  );
}

function FloatingCode() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="absolute top-20 right-8 hidden lg:block text-accent font-mono text-xs opacity-30 transition-transform duration-75"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="border border-accent rounded-lg p-3 w-48 bg-accent/5 backdrop-blur-sm">
        <div className="text-accent">&gt; build.sh</div>
        <div className="text-accent-muted mt-1">Initializing...</div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <div
        className="group relative p-6 rounded-lg border border-border transition-all duration-300 hover:border-accent hover:bg-accent/5 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-fg-muted text-sm mt-2">{description}</p>
          </div>
          <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        </div>
        <div
          className={`absolute bottom-0 left-0 h-1 bg-accent transition-all duration-300 ${
            isHovered ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    </Link>
  );
}

export function HomeHero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative space-y-8 pb-20">
        <BinaryBackground />
        <FloatingCode />

        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-fg">
              Matt
              <br />
              <span className="text-accent">Blanke</span>
            </h1>
            <p className="text-xl md:text-2xl text-fg-muted font-medium">
              Full-Stack Engineer
            </p>
          </div>

          <p className="max-w-2xl text-fg-muted text-base md:text-lg leading-relaxed pt-4">
            I build elegant, production-grade systems that merge clean architecture with
            thoughtful design. Currently exploring real-time systems, database design, and the
            intersection of developer experience and product thinking.
          </p>

          <div className="flex gap-4 pt-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors duration-200"
            >
              View Work →
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold text-fg hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Links Grid */}
      <section className="space-y-6 py-12 border-t border-border">
        <div>
          <h2 className="text-sm uppercase tracking-widest font-semibold text-fg-subtle mb-8">
            Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickLink
              href="/projects"
              title="Projects"
              description="Featured work, experiments, and technical deep dives"
              icon="💻"
            />
            <QuickLink
              href="/experience"
              title="Experience"
              description="Professional roles, internships, and career journey"
              icon="🚀"
            />
            <QuickLink
              href="/coursework"
              title="Learning"
              description="Academic projects, courses, and skill development"
              icon="📚"
            />
            <QuickLink
              href="/about"
              title="About"
              description="Background, interests, and how to get in touch"
              icon="👋"
            />
          </div>
        </div>
      </section>
    </>
  );
}
