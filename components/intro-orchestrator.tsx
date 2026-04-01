'use client';

/**
 * IntroOrchestrator — 4-phase animated intro sequence
 *
 * Phase 1 · hacker        Terminal boot lines + progress bar (~3s)
 * Phase 2 · stabilizing   Glitch burst → horizontal scan bars sweep in (~1.2s)
 * Phase 3 · materializing SVG wireframe draws over solid dark overlay (~2s)
 * Phase 4 · greeting      Green bar slides in from both screen edges, shows greeting,
 *                          expands to fill screen, then retracts from centre outward
 *                          to reveal the homepage. Wireframe fades while fully
 *                          covered — never visible to the user. (~3.3s)
 *
 * Skipped on repeat visits via sessionStorage key "intro-v4-seen".
 * Respects prefers-reduced-motion (skips directly to done).
 */

import { useEffect, useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Config — edit timing here
// ─────────────────────────────────────────────────────────────────────────────

const CFG = {
  charSpeed:              20,    // ms per character (normal)
  dotSpeed:               320,   // ms per dot in "..."  (3 dots ≈ 1s)
  normalPause:            130,   // ms pause after a normal line
  ellipsisPause:          [1800, 3000] as [number, number], // ms [min, max] after "..." line
  progressDuration:       2200,  // ms total for progress bar
  glitchFrames:           5,     // number of glitch frames
  glitchFrameMs:          70,    // ms per glitch frame
  scanCount:              14,    // horizontal scan bars
  scanStaggerMs:          38,    // ms between each bar
  scanDuration:           600,   // ms for all bars to sweep in
  wireDuration:           1800,  // ms total for wireframe to draw
  wireFadeDuration:       650,   // ms for wireframe to fade (runs while covered by green)
  // Greeting
  greetingFormDuration:   500,   // ms for bars to slide in from both edges
  greetingBarHold:        1400,  // ms to hold bar + greeting text
  greetingExpandDuration: 520,   // ms for panels to grow from bar height to full screen
  greetingRevealDuration: 650,   // ms for panels to retract from centre to edges
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
        transition: fading ? `opacity ${CFG.wireFadeDuration}ms ease` : 'none',
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
// Phase 4: Greeting transition
//
// Narrative:
//   1. Two green bars slide in simultaneously from the LEFT EDGE and RIGHT EDGE,
//      meeting at the centre. Text appears in the bar.
//   2. The bar expands vertically — top panel grows from the bar's top edge up
//      to the top of the screen; bottom panel grows downward. Full green screen.
//   3. Panels retract from centre outward: top panel collapses upward (top edge
//      stays, bottom edge rises to top), bottom panel collapses downward.
//      Homepage is revealed through the transparent overlay behind them.
// ─────────────────────────────────────────────────────────────────────────────

const BAR_H = 68; // px — height of the initial horizontal bar

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}

function GreetingTransition({
  barForming,
  barHolding,
  expanded,
  revealing,
}: {
  barForming: boolean;
  barHolding: boolean;
  expanded:   boolean;
  revealing:  boolean;
}) {
  const EASE = 'cubic-bezier(0.4,0,0.2,1)';

  // ── barAnim: triggers the CSS width transition after the bars mount.
  // Without this, the bars mount already at 50% with no animation.
  const [barAnim, setBarAnim] = useState(false);
  useEffect(() => {
    if (barForming) {
      requestAnimationFrame(() => setBarAnim(true));
    } else {
      setBarAnim(false);
    }
  }, [barForming]);

  // ── barFrac: scaleY ratio so the expanding panels START exactly at bar height,
  // giving a seamless bar → full-screen grow with no positional jump.
  const [barFrac, setBarFrac] = useState(0.1);
  useEffect(() => {
    const update = () => setBarFrac((BAR_H / 2) / (window.innerHeight / 2));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const showBars   = (barForming || barHolding) && !revealing;
  const showPanels = expanded && !revealing;
  const showReveal = revealing;

  return (
    <>
      {/* ── 1. Forming bars (slide in from left + right edges) ───────────── */}
      {showBars && (
        <>
          {/* Left half */}
          <div
            style={{
              position: 'absolute',
              top: `calc(50% - ${BAR_H / 2}px)`,
              left: 0,
              height: BAR_H,
              width: barAnim ? '50%' : '0%',
              background: '#10b981',
              transition: `width ${CFG.greetingFormDuration}ms ${EASE}`,
              zIndex: 2,
            }}
          />
          {/* Right half */}
          <div
            style={{
              position: 'absolute',
              top: `calc(50% - ${BAR_H / 2}px)`,
              right: 0,
              height: BAR_H,
              width: barAnim ? '50%' : '0%',
              background: '#10b981',
              transition: `width ${CFG.greetingFormDuration}ms ${EASE}`,
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* ── 2. Expanding panels (bar height → full screen) ───────────────── */}
      {/* Uses a CSS custom property so the keyframe starts exactly at bar height */}
      {showPanels && (
        <>
          {/* Top panel — grows upward from the bar's top edge */}
          <div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              top: 0, height: '50%',
              background: '#10b981',
              transformOrigin: 'bottom center',
              '--gt-bar-frac': barFrac,
              animation: `gt-expand ${CFG.greetingExpandDuration}ms ${EASE} forwards`,
              zIndex: 2,
            } as React.CSSProperties}
          />
          {/* Bottom panel — grows downward from the bar's bottom edge */}
          <div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              bottom: 0, height: '50%',
              background: '#10b981',
              transformOrigin: 'top center',
              '--gt-bar-frac': barFrac,
              animation: `gt-expand ${CFG.greetingExpandDuration}ms ${EASE} forwards`,
              zIndex: 2,
            } as React.CSSProperties}
          />
        </>
      )}

      {/* ── 3. Reveal panels (full-screen → retract from centre outward) ─── */}
      {/* These mount fully expanded (scaleY=1) and animate to scaleY=0.      */}
      {/* Top panel: transformOrigin top → bottom edge rises to top edge.     */}
      {/* Bottom panel: transformOrigin bottom → top edge sinks to bottom.    */}
      {showReveal && (
        <>
          <div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              top: 0, height: '50%',
              background: '#10b981',
              transformOrigin: 'top center',
              animation: `gt-reveal-top ${CFG.greetingRevealDuration}ms ${EASE} forwards`,
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              bottom: 0, height: '50%',
              background: '#10b981',
              transformOrigin: 'bottom center',
              animation: `gt-reveal-bottom ${CFG.greetingRevealDuration}ms ${EASE} forwards`,
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* ── Centre text — shown while bar is held, hidden before reveal ───── */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: barHolding && !expanded && !revealing ? 1 : 0,
          transition: 'opacity 0.25s ease',
          background: '#10b981',
          height: BAR_H,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(14px, 2vw, 24px)',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: '#0a1a14',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {getGreeting()} Welcome.
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IntroOrchestrator — main export
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'hacker' | 'stabilizing' | 'materializing' | 'greeting' | 'done';

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
  const [gx,      setGx]      = useState(0);
  const [gSkew,   setGSkew]   = useState(0);
  const [gBright, setGBright] = useState(1);

  const [scanVisible, setScanVisible] = useState(false);
  const [scanFading,  setScanFading]  = useState(false);

  const [wireActive, setWireActive] = useState(false);
  const [wireFading, setWireFading] = useState(false);

  // Greeting sub-states
  const [greetingBarForming,  setGreetingBarForming]  = useState(false);
  const [greetingBarHolding,  setGreetingBarHolding]  = useState(false);
  const [greetingExpanded,    setGreetingExpanded]    = useState(false);
  const [greetingRevealing,   setGreetingRevealing]   = useState(false);

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

  // ── Single orchestrating effect ───────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;

    async function run() {
      // Wait for HackerTerminal to finish via Promise handoff
      await new Promise<void>(resolve => { hackerDoneRef.current = resolve; });
      if (cancelled) return;

      // ── Stabilizing ───────────────────────────────────────────────────────
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

      setScanVisible(true);
      await sleep(CFG.scanDuration + CFG.scanCount * CFG.scanStaggerMs + 120);
      if (cancelled) return;

      // ── Materializing — wireframe draws on solid dark overlay ─────────────
      setPhase('materializing');
      setScanFading(true);
      setWireActive(true);
      await sleep(CFG.wireDuration + 400);
      if (cancelled) return;

      // ── Greeting ──────────────────────────────────────────────────────────
      setPhase('greeting');

      // 1. Bars slide in from both edges
      setGreetingBarForming(true);
      await sleep(CFG.greetingFormDuration);
      if (cancelled) return;

      // 2. Text appears, user reads
      setGreetingBarHolding(true);
      await sleep(CFG.greetingBarHold);
      if (cancelled) return;

      // 3. Panels expand to fill screen; wireframe fades while safely covered
      setGreetingExpanded(true);
      setWireFading(true);    // fades behind green — user never sees it
      // Wait for both the expand animation AND the wire fade to complete
      await sleep(Math.max(CFG.greetingExpandDuration + 100, CFG.wireFadeDuration + 100));
      if (cancelled) return;

      // 4. Panels retract from centre outward, revealing homepage
      setGreetingRevealing(true);
      await sleep(CFG.greetingRevealDuration + 80);
      if (cancelled) return;

      sessionStorage.setItem('intro-v4-seen', '1');
      setPhase('done');
    }

    run();
    return () => { cancelled = true; };
  }, [shouldShow]);

  // ── Render guard ─────────────────────────────────────────────────────────
  if (shouldShow === null || !shouldShow || phase === 'done') return null;

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
          // Solid dark throughout; transparent only during reveal so homepage shows through
          background: greetingRevealing ? 'transparent' : '#0d0d0b',
          // Glitch transform applied to whole overlay
          transform: `translateX(${gx}px) skewX(${gSkew}deg)`,
          filter: gBright !== 1 ? `brightness(${gBright})` : 'none',
          pointerEvents: greetingRevealing ? 'none' : 'auto',
        }}
      >
        {/* Phase 1: hacker terminal — fades out during stabilizing */}
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

        {/* Phase 3: wireframe — stays mounted during greeting so it can fade
            while covered (invisible to user) before the reveal uncovers it */}
        {(phase === 'materializing' || phase === 'greeting') && (
          <WireframeSVG active={wireActive} fading={wireFading} />
        )}

        {/* Phase 4: greeting bar + panel expand/reveal */}
        {phase === 'greeting' && (
          <GreetingTransition
            barForming={greetingBarForming}
            barHolding={greetingBarHolding}
            expanded={greetingExpanded}
            revealing={greetingRevealing}
          />
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

        /* Bar height → full panel height, anchored at the bar edge closest to centre */
        @keyframes gt-expand {
          from { transform: scaleY(var(--gt-bar-frac, 0.1)); }
          to   { transform: scaleY(1); }
        }

        /* Top panel retracts: bottom edge rises toward top, centre clears first */
        @keyframes gt-reveal-top {
          from { transform: scaleY(1); }
          to   { transform: scaleY(0); }
        }

        /* Bottom panel retracts: top edge sinks toward bottom */
        @keyframes gt-reveal-bottom {
          from { transform: scaleY(1); }
          to   { transform: scaleY(0); }
        }
      `}</style>
    </>
  );
}
