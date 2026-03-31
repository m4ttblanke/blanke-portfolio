'use client';

/**
 * IntroOrchestrator — 4-phase animated intro sequence
 *
 * Phase 1 · hacker        Terminal boot lines + progress bar (~3s)
 * Phase 2 · stabilizing   Glitch burst → horizontal scan bars sweep in (~1.2s)
 * Phase 3 · materializing SVG wireframe draws over blurred page (~2s)
 * Phase 4 · reveal        Wireframe + overlay fade out, page appears (~0.8s)
 *
 * Skipped on repeat visits via sessionStorage key "intro-v4-seen".
 * Respects prefers-reduced-motion (skips directly to done).
 */

import { useEffect, useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Config — edit timing here
// ─────────────────────────────────────────────────────────────────────────────

const CFG = {
  charSpeed:        20,    // ms per character (normal)
  dotSpeed:         320,   // ms per dot in "..."  (3 dots ≈ 1s)
  normalPause:      130,   // ms pause after a normal line
  ellipsisPause:    [1800, 3000] as [number, number], // ms [min, max] after "..." line
  progressDuration: 2200,  // ms total for progress bar
  glitchFrames:     5,     // number of glitch frames
  glitchFrameMs:    70,    // ms per glitch frame
  scanCount:        14,    // horizontal scan bars
  scanStaggerMs:    38,    // ms between each bar
  scanDuration:     600,   // ms for all bars to sweep in
  wireDuration:     1800,  // ms total for wireframe to draw
  revealDuration:   750,   // ms for final fade-out
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function isEllipsisDot(text: string, i: number) {
  if (text[i] !== '.') return false;
  const lo = Math.max(0, i - 2);
  const hi = Math.min(text.length, i + 3);
  return text.slice(lo, hi).includes('..');
}

function endsWithEllipsis(text: string) {
  return /\.\.\.$/.test(text.trimEnd());
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot sequence lines
// ─────────────────────────────────────────────────────────────────────────────

function makeLines(projectCount: number, experienceCount: number) {
  return [
    '> ssh matt@blanke.dev',
    '> Connection established.',
    '> Authenticating... ACCESS GRANTED',
    '> Scanning portfolio directory...',
    `> Projects located: ${projectCount}`,
    `> Experience logs: ${experienceCount} entries`,
    '> Compiling interface... DONE',
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar segments (stuttering)
// ─────────────────────────────────────────────────────────────────────────────

const SEGMENTS = [
  { target: 30,  stepMs: 16 },
  { pause: () => rand(200, 380) },
  { target: 33,  stepMs: 22, drop: 2 },
  { target: 62,  stepMs: 15 },
  { pause: () => rand(240, 430) },
  { target: 65,  stepMs: 18 },
  { target: 85,  stepMs: 15 },
  { pause: () => rand(150, 280) },
  { target: 100, stepMs: 13 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1: Hacker terminal
// ─────────────────────────────────────────────────────────────────────────────

function HackerTerminal({
  projectCount,
  experienceCount,
  opacity,
  onComplete,
}: {
  projectCount: number;
  experienceCount: number;
  opacity: number;
  onComplete: () => void;
}) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine]       = useState('');
  const [progress, setProgress]             = useState(0);
  const [showProgress, setShowProgress]     = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await sleep(200);

      for (const text of makeLines(projectCount, experienceCount)) {
        if (cancelled) return;
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return;
          setCurrentLine(text.slice(0, i));
          const delay = isEllipsisDot(text, i - 1)
            ? CFG.dotSpeed + rand(0, 80)
            : CFG.charSpeed + rand(0, 12);
          await sleep(delay);
        }
        if (cancelled) return;
        setCompletedLines(prev => [...prev, text]);
        setCurrentLine('');
        const pause = endsWithEllipsis(text)
          ? rand(CFG.ellipsisPause[0], CFG.ellipsisPause[1])
          : CFG.normalPause;
        await sleep(pause);
      }

      if (cancelled) return;
      setShowProgress(true);

      let current = 0;
      for (const seg of SEGMENTS) {
        if (cancelled) return;
        if ('pause' in seg && typeof seg.pause === 'function') {
          await sleep(seg.pause());
          continue;
        }
        const { target, stepMs, drop } = seg as { target: number; stepMs: number; drop?: number };
        if (drop && current > drop) {
          setProgress(Math.max(0, current - drop));
          await sleep(260);
          if (cancelled) return;
        }
        while (current < target) {
          if (cancelled) return;
          current = Math.min(target, current + 1);
          setProgress(current);
          await sleep(stepMs + rand(0, 7));
        }
      }

      await sleep(300);
      if (!cancelled && !calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
    }

    run();
    return () => { cancelled = true; };
  }, []); // intentionally runs once

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transition: opacity < 1 ? 'opacity 0.5s ease' : 'none',
        display: 'flex',
        alignItems: 'flex-start',
        padding: 'clamp(48px, 12vh, 130px) clamp(40px, 9vw, 110px)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 'clamp(11px, 1.3vw, 14px)',
        lineHeight: 1.85,
        color: '#10b981',
      }}
    >
      <div>
        {completedLines.map((line, i) => (
          <p key={i} style={{ margin: 0 }}>{line}</p>
        ))}
        {currentLine && (
          <p style={{ margin: 0 }}>
            {currentLine}<span className="hk-cursor">▋</span>
          </p>
        )}
        {showProgress && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>&gt; Initializing portfolio...</span>
            <span style={{ display: 'inline-block', border: '1px solid #10b981', width: 130, height: 12 }}>
              <span style={{
                display: 'block', height: '100%',
                width: `${progress}%`, background: '#10b981',
                transition: 'width 55ms linear',
              }} />
            </span>
            <span>{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2: Scan bars
// ─────────────────────────────────────────────────────────────────────────────

function ScanBars({ visible, fading }: { visible: boolean; fading: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: CFG.scanCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0, right: 0,
            top: `${(i / CFG.scanCount) * 100}%`,
            height: `${100 / CFG.scanCount}%`,
            borderTop: '1px solid rgba(16,185,129,0.22)',
            background: i % 2 === 0 ? 'rgba(16,185,129,0.025)' : 'transparent',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left center',
            transition: [
              `transform 0.42s cubic-bezier(0.4,0,0.2,1) ${i * CFG.scanStaggerMs}ms`,
              `opacity 0.45s ease ${fading ? i * 18 : 0}ms`,
            ].join(', '),
            opacity: fading ? 0 : (visible ? 1 : 0),
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3: Wireframe SVG
// Page layout approximated in a 100×100 viewBox (% of viewport)
// ─────────────────────────────────────────────────────────────────────────────

function WireframeSVG({ active, fading }: { active: boolean; fading: boolean }) {
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (!active) { setDraw(false); return; }
    const t = setTimeout(() => setDraw(true), 60);
    return () => clearTimeout(t);
  }, [active]);

  // Shorthand for stroke-dashoffset animated line/rect style
  function wire(delayS: number, width = 0.28, dimmed = false): React.CSSProperties {
    return {
      fill: 'none',
      stroke: dimmed ? 'rgba(16,185,129,0.35)' : '#10b981',
      strokeWidth: width,
      strokeDasharray: 3000,
      strokeDashoffset: draw ? 0 : 3000,
      opacity: draw ? 1 : 0,
      transition: draw
        ? `stroke-dashoffset ${CFG.wireDuration * 0.001 * 0.6}s ease ${delayS}s, opacity 0.2s ease ${delayS}s`
        : 'none',
    };
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.65s ease',
        pointerEvents: 'none',
      }}
    >
      {/* ── Nav bar ──────────────────────────────────────── */}
      <rect x="0"  y="0"   width="100" height="7"   style={wire(0)} />
      {/* logo box */}
      <rect x="1.5" y="1.5" width="4"   height="4"   style={wire(0.08)} />
      {/* nav link stubs */}
      <line x1="60" y1="3.5" x2="67" y2="3.5" style={wire(0.14)} />
      <line x1="70" y1="3.5" x2="77" y2="3.5" style={wire(0.18)} />
      <line x1="80" y1="3.5" x2="87" y2="3.5" style={wire(0.22)} />
      <line x1="90" y1="3.5" x2="97" y2="3.5" style={wire(0.26)} />

      {/* ── Hero section ─────────────────────────────────── */}
      <rect x="8" y="9" width="84" height="44" style={wire(0.15)} />

      {/* Headline — thick lines = large text */}
      <line x1="13" y1="19" x2="40" y2="19" style={wire(0.30, 1.4)} />
      <line x1="13" y1="27" x2="52" y2="27" style={wire(0.36, 1.4)} />
      {/* Subtitle */}
      <line x1="13" y1="33" x2="36" y2="33" style={wire(0.42, 0.5)} />

      {/* Description text block */}
      <line x1="13" y1="37"   x2="60" y2="37"   style={wire(0.48, 0.25, true)} />
      <line x1="13" y1="39.5" x2="56" y2="39.5" style={wire(0.51, 0.25, true)} />
      <line x1="13" y1="42"   x2="52" y2="42"   style={wire(0.54, 0.25, true)} />

      {/* CTA buttons */}
      <rect x="13" y="44.5" width="15" height="4.5" style={wire(0.58)} />
      <rect x="30" y="44.5" width="13" height="4.5" style={wire(0.63)} />

      {/* Code typewriter box (right of hero) */}
      <rect x="63" y="14" width="22" height="19" style={wire(0.30)} />
      <line x1="66" y1="20"   x2="82" y2="20"   style={wire(0.44, 0.25, true)} />
      <line x1="66" y1="23.5" x2="79" y2="23.5" style={wire(0.48, 0.25, true)} />
      <line x1="66" y1="27"   x2="81" y2="27"   style={wire(0.52, 0.25, true)} />

      {/* ── Explore section ──────────────────────────────── */}
      {/* Section label */}
      <line x1="8" y1="57" x2="20" y2="57" style={wire(0.68, 0.3)} />

      {/* 2 × 2 card grid */}
      <rect x="8"  y="61" width="40" height="17" style={wire(0.72)} />
      <rect x="52" y="61" width="40" height="17" style={wire(0.80)} />
      <rect x="8"  y="81" width="40" height="15" style={wire(0.88)} />
      <rect x="52" y="81" width="40" height="15" style={wire(0.96)} />

      {/* Card title lines */}
      <line x1="13" y1="68"   x2="29" y2="68"   style={wire(0.78, 0.3)} />
      <line x1="57" y1="68"   x2="73" y2="68"   style={wire(0.85, 0.3)} />
      <line x1="13" y1="88"   x2="27" y2="88"   style={wire(0.93, 0.3)} />
      <line x1="57" y1="88"   x2="71" y2="88"   style={wire(1.00, 0.3)} />

      {/* Card description lines */}
      <line x1="13" y1="71.5" x2="42" y2="71.5" style={wire(0.82, 0.2, true)} />
      <line x1="57" y1="71.5" x2="86" y2="71.5" style={wire(0.89, 0.2, true)} />
      <line x1="13" y1="91.5" x2="40" y2="91.5" style={wire(0.97, 0.2, true)} />
      <line x1="57" y1="91.5" x2="84" y2="91.5" style={wire(1.04, 0.2, true)} />

      {/* Card hover-bar stubs at bottom of each card */}
      <line x1="8"  y1="78"   x2="48" y2="78"   style={wire(0.84, 0.2, true)} />
      <line x1="52" y1="78"   x2="92" y2="78"   style={wire(0.91, 0.2, true)} />
      <line x1="8"  y1="96"   x2="48" y2="96"   style={wire(0.99, 0.2, true)} />
      <line x1="52" y1="96"   x2="92" y2="96"   style={wire(1.06, 0.2, true)} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IntroOrchestrator — main export
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'hacker' | 'stabilizing' | 'materializing' | 'reveal' | 'done';

export function IntroOrchestrator({
  projectCount,
  experienceCount,
}: {
  projectCount: number;
  experienceCount: number;
}) {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [phase, setPhase]           = useState<Phase>('hacker');

  // Glitch state: transform + filter applied to overlay
  const [gx, setGx]         = useState(0);
  const [gSkew, setGSkew]   = useState(0);
  const [gBright, setGBright] = useState(1);

  const [scanVisible, setScanVisible] = useState(false);
  const [scanFading,  setScanFading]  = useState(false);
  const [wireActive,  setWireActive]  = useState(false);
  const [wireFading,  setWireFading]  = useState(false);
  const [overlayOut,  setOverlayOut]  = useState(false);

  // ── Session + reduced-motion gate ────────────────────────────────────────
  useEffect(() => {
    const seen    = sessionStorage.getItem('intro-v4-seen');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) {
      setShouldShow(false);
    } else {
      setShouldShow(true);
    }
  }, []);

  // Ref-based handoff: HackerTerminal calls this to signal completion
  const hackerDoneRef = useRef<(() => void) | null>(null);

  const onHackerComplete = useCallback(() => {
    hackerDoneRef.current?.();
  }, []);

  // ── Single orchestrating effect — only re-runs if shouldShow changes ──────
  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;

    async function run() {
      // Wait for HackerTerminal to finish via Promise handoff
      await new Promise<void>(resolve => { hackerDoneRef.current = resolve; });
      if (cancelled) return;

      // ── Stabilizing phase ─────────────────────────────────────────────────
      setPhase('stabilizing');

      const glitchFrames = [
        { x:  6, skew: -4, bright: 1.6 },
        { x: -5, skew:  3, bright: 0.65 },
        { x:  4, skew: -2, bright: 1.4 },
        { x: -3, skew:  2, bright: 0.75 },
        { x:  2, skew: -1, bright: 1.2 },
        { x:  0, skew:  0, bright: 1.0 },
      ];
      for (const f of glitchFrames) {
        if (cancelled) return;
        setGx(f.x); setGSkew(f.skew); setGBright(f.bright);
        await sleep(CFG.glitchFrameMs);
      }

      if (cancelled) return;

      // Scan bars sweep in
      setScanVisible(true);
      await sleep(CFG.scanDuration + CFG.scanCount * CFG.scanStaggerMs + 120);
      if (cancelled) return;

      // ── Materializing phase ───────────────────────────────────────────────
      setPhase('materializing');
      setScanFading(true);
      setWireActive(true);
      await sleep(CFG.wireDuration + 400);
      if (cancelled) return;

      // ── Reveal phase ──────────────────────────────────────────────────────
      setPhase('reveal');
      setWireFading(true);
      setOverlayOut(true);
      await sleep(CFG.revealDuration);
      if (cancelled) return;

      sessionStorage.setItem('intro-v4-seen', '1');
      setPhase('done');
    }

    run();
    return () => { cancelled = true; };
  }, [shouldShow]);

  // ── Render guard ─────────────────────────────────────────────────────────
  if (shouldShow === null || !shouldShow || phase === 'done') return null;

  const isMaterializing = phase === 'materializing' || phase === 'reveal';

  return (
    <>
      {/* ── Main overlay ──────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          // Background transitions: opaque → semi-transparent → gone
          background: overlayOut
            ? 'rgba(13,13,11,0)'
            : isMaterializing
              ? 'rgba(13,13,11,0.80)'
              : '#0d0d0b',
          // Backdrop blur during wireframe phase (blurs actual page beneath)
          backdropFilter: isMaterializing && !overlayOut ? 'blur(10px)' : 'blur(0px)',
          transition: [
            'background 0.65s ease',
            'backdrop-filter 0.65s ease',
          ].join(', '),
          // Glitch transform applied to whole overlay
          transform: `translateX(${gx}px) skewX(${gSkew}deg)`,
          filter: `brightness(${gBright})`,
        }}
      >
        {/* Phase 1: hacker terminal — visible during hacker, fades on stabilizing */}
        {(phase === 'hacker' || phase === 'stabilizing') && (
          <HackerTerminal
            projectCount={projectCount}
            experienceCount={experienceCount}
            opacity={phase === 'hacker' ? 1 : 0}
            onComplete={onHackerComplete}
          />
        )}

        {/* Phase 2: scan bars */}
        <ScanBars visible={scanVisible} fading={scanFading} />

        {/* Phase 3+4: wireframe */}
        {isMaterializing && (
          <WireframeSVG active={wireActive} fading={wireFading} />
        )}
      </div>

      {/* ── Global styles ─────────────────────────────────────────────────── */}
      <style>{`
        .hk-cursor {
          display: inline-block;
          margin-left: 1px;
          animation: hk-blink 1s step-end infinite;
        }
        @keyframes hk-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  );
}
