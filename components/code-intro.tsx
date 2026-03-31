'use client';

import { useEffect, useState, useRef } from 'react';

// ─── Syntax token colors (Material Theme Palenight) ─────────────────────────
const C = {
  comment:   '#546e7a',
  keyword:   '#c792ea',
  string:    '#c3e88d',
  type:      '#ffcb6b',
  fn:        '#82aaff',
  cyan:      '#89ddff',
  bool:      '#ff5370',
  text:      '#eeffff',
  decorator: '#ff9cac',
  num:       '#f78c6c',
  op:        '#89ddff',
} as const;

type Tok = { t: string; c: string };
type Line = Tok[];

// ─── Code content ────────────────────────────────────────────────────────────
const LINES: Line[] = [
  [{ t: '// portfolio/src/engineer.ts', c: C.comment }],
  [{ t: 'import', c: C.keyword }, { t: ' { Project, Experience } ', c: C.text }, { t: 'from', c: C.keyword }, { t: ' "@/types"', c: C.string }],
  [{ t: 'import', c: C.keyword }, { t: ' type { Stack } ', c: C.text }, { t: 'from', c: C.keyword }, { t: ' "@/convex/schema"', c: C.string }],
  [],
  [{ t: 'export interface ', c: C.keyword }, { t: 'EngineerProfile ', c: C.type }, { t: '{', c: C.text }],
  [{ t: '  name', c: C.text }, { t: ': ', c: C.cyan }, { t: 'string', c: C.keyword }, { t: ';', c: C.text }],
  [{ t: '  role', c: C.text }, { t: ': ', c: C.cyan }, { t: '"Full-Stack Engineer"', c: C.string }, { t: ';', c: C.text }],
  [{ t: '  stack', c: C.text }, { t: ': ', c: C.cyan }, { t: 'readonly ', c: C.keyword }, { t: 'string', c: C.keyword }, { t: '[];', c: C.text }],
  [{ t: '  available', c: C.text }, { t: ': ', c: C.cyan }, { t: 'boolean', c: C.keyword }, { t: ';', c: C.text }],
  [{ t: '}', c: C.text }],
  [],
  [{ t: 'const ', c: C.keyword }, { t: 'matt', c: C.fn }, { t: ': ', c: C.cyan }, { t: 'EngineerProfile ', c: C.type }, { t: '= {', c: C.text }],
  [{ t: '  name', c: C.text }, { t: ': ', c: C.cyan }, { t: '"Matt Blanke"', c: C.string }, { t: ',', c: C.text }],
  [{ t: '  role', c: C.text }, { t: ': ', c: C.cyan }, { t: '"Full-Stack Engineer"', c: C.string }, { t: ',', c: C.text }],
  [{ t: '  stack', c: C.text }, { t: ': ', c: C.cyan }, { t: '[', c: C.text }, { t: '"TypeScript"', c: C.string }, { t: ', ', c: C.text }, { t: '"React"', c: C.string }, { t: ', ', c: C.text }, { t: '"Node.js"', c: C.string }, { t: '],', c: C.text }],
  [{ t: '  available', c: C.text }, { t: ': ', c: C.cyan }, { t: 'true', c: C.bool }, { t: ',', c: C.text }],
  [{ t: '};', c: C.text }],
  [],
  [{ t: 'export async function ', c: C.keyword }, { t: 'getProjects', c: C.fn }, { t: '(): ', c: C.text }, { t: 'Promise', c: C.type }, { t: '<', c: C.text }, { t: 'Project', c: C.type }, { t: '[]> {', c: C.text }],
  [{ t: '  return ', c: C.keyword }, { t: 'db', c: C.fn }, { t: '.projects', c: C.text }],
  [{ t: '    .filter(', c: C.text }, { t: 'p ', c: C.fn }, { t: '=>', c: C.op }, { t: ' p.published)', c: C.text }],
  [{ t: '    .sort((', c: C.text }, { t: 'a', c: C.fn }, { t: ', ', c: C.text }, { t: 'b', c: C.fn }, { t: ')', c: C.text }, { t: ' =>', c: C.op }, { t: ' b.date - a.date);', c: C.text }],
  [{ t: '}', c: C.text }],
  [],
  [{ t: '// ─────────────────────────────────────────', c: C.comment }],
  [{ t: '# portfolio/config.py', c: C.comment }],
  [],
  [{ t: '@dataclass', c: C.decorator }],
  [{ t: 'class ', c: C.keyword }, { t: 'MattBlanke', c: C.type }, { t: ':', c: C.text }],
  [{ t: '    name', c: C.text }, { t: ': ', c: C.cyan }, { t: 'str ', c: C.keyword }, { t: '= ', c: C.text }, { t: '"Matt Blanke"', c: C.string }],
  [{ t: '    role', c: C.text }, { t: ': ', c: C.cyan }, { t: 'str ', c: C.keyword }, { t: '= ', c: C.text }, { t: '"Full-Stack Engineer"', c: C.string }],
  [{ t: '    available', c: C.text }, { t: ': ', c: C.cyan }, { t: 'bool ', c: C.keyword }, { t: '= ', c: C.text }, { t: 'True', c: C.bool }],
  [{ t: '    contact', c: C.text }, { t: ': ', c: C.cyan }, { t: 'str ', c: C.keyword }, { t: '= ', c: C.text }, { t: '"matt@blanke.dev"', c: C.string }],
  [],
  [{ t: '    def ', c: C.keyword }, { t: 'hire', c: C.fn }, { t: '(self) ', c: C.text }, { t: '->', c: C.op }, { t: ' str:', c: C.text }],
  [{ t: '        if ', c: C.keyword }, { t: 'not ', c: C.keyword }, { t: 'self.available:', c: C.text }],
  [{ t: '            raise ', c: C.keyword }, { t: 'ValueError', c: C.type }, { t: '(', c: C.text }, { t: '"Not available"', c: C.string }, { t: ')', c: C.text }],
  [{ t: '        return ', c: C.keyword }, { t: 'f"Onboarding ', c: C.string }, { t: '{', c: C.op }, { t: 'self.name', c: C.text }, { t: '}"', c: C.string }],
];

// Split point as % of screen height — aligns with where the nav ends
const SPLIT_PCT = 11;

type Phase = 'entering' | 'scanning' | 'splitting' | 'done';

function CodeLines({ visibleCount }: { visibleCount: number }) {
  return (
    <div style={{ padding: '48px 0 48px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '22px' }}>
      {LINES.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity 0.25s ease ${Math.min(i, visibleCount) * 0.001}s, transform 0.25s ease`,
            minHeight: '22px',
          }}
        >
          {/* Line number gutter */}
          <span style={{ width: '44px', flexShrink: 0, textAlign: 'right', paddingRight: '20px', color: '#3d4b5a', userSelect: 'none' }}>
            {i + 1}
          </span>
          {/* Token content */}
          <span>
            {line.length === 0
              ? '\u00A0'
              : line.map((tok, j) => (
                  <span key={j} style={{ color: tok.c }}>{tok.t}</span>
                ))}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CodeIntro({ projectCount, experienceCount }: { projectCount: number; experienceCount: number }) {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>('entering');
  const [visibleCount, setVisibleCount] = useState(0);
  const [scanY, setScanY] = useState(-4);         // % from top
  const [scanOpacity, setScanOpacity] = useState(0);

  // ── Session gate ─────────────────────────────────────────────────────────
  useEffect(() => {
    const seen = sessionStorage.getItem('code-intro-seen');
    setShouldShow(!seen);
  }, []);

  // ── Orchestration ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow) return;
    let frame: number;
    let cancelled = false;

    function sleep(ms: number) {
      return new Promise<void>((r) => setTimeout(r, ms));
    }

    async function run() {
      // Phase 1: reveal lines quickly
      for (let i = 0; i <= LINES.length; i++) {
        if (cancelled) return;
        setVisibleCount(i);
        await sleep(55);
      }

      await sleep(400);
      if (cancelled) return;

      // Phase 2: scan line sweeps top → bottom
      setPhase('scanning');
      setScanOpacity(1);
      const scanDuration = 700;
      const scanStart = performance.now();
      await new Promise<void>((resolve) => {
        function tick() {
          const elapsed = performance.now() - scanStart;
          const pct = Math.min(elapsed / scanDuration, 1);
          setScanY(pct * 110 - 4);
          if (pct < 1) {
            frame = requestAnimationFrame(tick);
          } else {
            setScanOpacity(0);
            resolve();
          }
        }
        frame = requestAnimationFrame(tick);
      });

      await sleep(180);
      if (cancelled) return;

      // Phase 3: split
      setPhase('splitting');
      await sleep(900);
      if (cancelled) return;

      sessionStorage.setItem('code-intro-seen', '1');
      setPhase('done');
    }

    run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [shouldShow]);

  if (shouldShow === null || phase === 'done' || !shouldShow) return null;

  const bgColor = '#0d1117'; // rich dark — distinct from site so split is visible
  const isSplitting = phase === 'splitting';

  const overlayBase: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    zIndex: 9999,
    background: bgColor,
    overflow: 'hidden',
    willChange: 'transform',
  };

  const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <>
      {/* ── Scan line ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: `${scanY}%`,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #10b981 20%, #6ee7b7 50%, #10b981 80%, transparent 100%)',
          boxShadow: '0 0 20px 4px rgba(16,185,129,0.6)',
          zIndex: 10000,
          opacity: scanOpacity,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Top half of overlay (clips to nav region, slides UP) ────── */}
      <div
        style={{
          ...overlayBase,
          top: 0,
          height: `${SPLIT_PCT}vh`,
          transform: isSplitting ? 'translateY(-100%)' : 'translateY(0)',
          transition: isSplitting ? `transform 0.75s ${ease}` : 'none',
          filter: phase === 'scanning' ? 'brightness(1.15)' : 'brightness(1)',
        }}
      >
        <CodeLines visibleCount={visibleCount} />
      </div>

      {/* ── Bottom half of overlay (clips below nav, slides DOWN) ────── */}
      <div
        style={{
          ...overlayBase,
          top: `${SPLIT_PCT}vh`,
          bottom: 0,
          transform: isSplitting ? 'translateY(100%)' : 'translateY(0)',
          transition: isSplitting ? `transform 0.82s ${ease} 0.06s` : 'none',
          filter: phase === 'scanning' ? 'brightness(1.15)' : 'brightness(1)',
        }}
      >
        {/* Offset the content so it aligns with the top half */}
        <div style={{ marginTop: `calc(-${SPLIT_PCT}vh)` }}>
          <CodeLines visibleCount={visibleCount} />
        </div>
      </div>

      {/* ── Thin accent gap that appears between the two halves ──────── */}
      {isSplitting && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: `${SPLIT_PCT}vh`,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #10b981, #6ee7b7, #10b981, transparent)',
            boxShadow: '0 0 16px 3px rgba(16,185,129,0.5)',
            zIndex: 10001,
            opacity: 1,
            animation: 'intro-split-glow 0.8s ease forwards',
          }}
        />
      )}

      <style>{`
        @keyframes intro-split-glow {
          0%   { opacity: 1; }
          60%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
