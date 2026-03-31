'use client';

import { useEffect, useState } from 'react';

const BOOT_SEQUENCE = [
  { text: '> ssh matt@blanke.dev' },
  { text: '> Connection established.' },
  { text: '> Authenticating... ACCESS GRANTED' },
  { text: '> Scanning portfolio directory...' },
  { text: '> Projects located: 12' },
  { text: '> Experience logs: 4 entries' },
  { text: '> Compiling interface... DONE' },
];

// Base speed for normal characters (ms)
const CHAR_SPEED = 24;
// Speed per dot in an ellipsis (ms) — ~1 per second
const DOT_SPEED = 950;
// Pause after a line that ends with ellipsis (ms) — randomised in run()
const ELLIPSIS_PAUSE_MIN = 2000;
const ELLIPSIS_PAUSE_MAX = 4000;
// Pause after normal lines (ms)
const NORMAL_PAUSE = 220;

// Progress segments: run to `target` %, then optional pause
const PROGRESS_SEGMENTS = [
  { target: 24,  stepMs: 18  },
  { pause: () => 800  + Math.random() * 700  }, // stutter ~0.8–1.5s
  { target: 27,  stepMs: 30, drop: 3 },          // slight drop back then continue
  { target: 57,  stepMs: 20  },
  { pause: () => 1100 + Math.random() * 900  }, // stutter ~1.1–2s
  { target: 60,  stepMs: 12  },
  { target: 81,  stepMs: 18  },
  { pause: () => 600  + Math.random() * 500  }, // stutter ~0.6–1.1s
  { target: 100, stepMs: 14  },
];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}

/** Returns true if the character at index i is a dot that belongs to a "..." run. */
function isEllipsisDot(text: string, i: number): boolean {
  if (text[i] !== '.') return false;
  // Check the surrounding window for at least two consecutive dots
  const lo = Math.max(0, i - 2);
  const hi = Math.min(text.length, i + 3);
  return text.slice(lo, hi).includes('..');
}

/** True if text ends with "..." (ignoring trailing suffix after the dots) */
function endsWithEllipsis(text: string): boolean {
  return /\.\.\.$/.test(text.trimEnd());
}

export function HackerIntro() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'progress' | 'greeting'>('typing');
  const [greetingText, setGreetingText] = useState('');
  const [fading, setFading] = useState(false);

  // Only show once per session
  useEffect(() => {
    const seen = sessionStorage.getItem('hacker-intro-seen');
    setShouldShow(!seen);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;

    async function run() {
      await sleep(300);

      // ── Phase 1: boot lines ──────────────────────────────────────
      for (const { text } of BOOT_SEQUENCE) {
        if (cancelled) return;

        // Type character by character, slowing way down for each "." in "..."
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return;
          setCurrentLine(text.slice(0, i));
          const delay = isEllipsisDot(text, i - 1)
            ? DOT_SPEED + Math.random() * 150
            : CHAR_SPEED + Math.random() * 14;
          await sleep(delay);
        }

        if (cancelled) return;
        setCompletedLines((prev) => [...prev, text]);
        setCurrentLine('');

        // Lines with trailing ellipsis get a long dramatic pause
        const pause = endsWithEllipsis(text)
          ? ELLIPSIS_PAUSE_MIN + Math.random() * (ELLIPSIS_PAUSE_MAX - ELLIPSIS_PAUSE_MIN)
          : NORMAL_PAUSE;
        await sleep(pause);
      }

      if (cancelled) return;

      // ── Phase 2: stuttering progress bar ────────────────────────
      setPhase('progress');
      let current = 0;

      for (const seg of PROGRESS_SEGMENTS) {
        if (cancelled) return;

        if ('pause' in seg && typeof seg.pause === 'function') {
          // Stutter: freeze progress
          await sleep(seg.pause());
          continue;
        }

        const { target, stepMs, drop } = seg as { target: number; stepMs: number; drop?: number };

        // Optional micro-drop to simulate hang/retry
        if (drop && current > drop) {
          const dropTo = Math.max(0, current - drop);
          setProgress(dropTo);
          await sleep(280);
          if (cancelled) return;
        }

        // Advance to target
        while (current < target) {
          if (cancelled) return;
          current = Math.min(target, current + 1);
          setProgress(current);
          await sleep(stepMs + Math.random() * 8);
        }
      }

      await sleep(380);
      if (cancelled) return;

      // ── Phase 3: greeting ────────────────────────────────────────
      setPhase('greeting');
      const greeting = getGreeting();
      await sleep(200);
      for (let i = 1; i <= greeting.length; i++) {
        if (cancelled) return;
        setGreetingText(greeting.slice(0, i));
        await sleep(CHAR_SPEED + 18);
      }

      await sleep(1200);
      if (cancelled) return;

      // Fade out and unmount
      setFading(true);
      await sleep(800);
      if (cancelled) return;
      sessionStorage.setItem('hacker-intro-seen', '1');
      setShouldShow(false);
    }

    run();
    return () => { cancelled = true; };
  }, [shouldShow]);

  if (shouldShow === null || !shouldShow) return null;

  const greeting = getGreeting();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0d0d0b',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        padding: 'clamp(40px, 15vh, 140px) clamp(32px, 10vw, 120px)',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div>
        {completedLines.map((line, i) => (
          <p key={i} style={lineStyle}>{line}</p>
        ))}

        {currentLine && (
          <p style={lineStyle}>
            {currentLine}<span className="intro-cursor">▋</span>
          </p>
        )}

        {(phase === 'progress' || phase === 'greeting') && (
          <p style={{ ...lineStyle, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>&gt; Initializing portfolio...</span>
            <span style={{
              display: 'inline-block',
              border: '1px solid #10b981',
              width: '120px',
              height: '13px',
              verticalAlign: 'middle',
            }}>
              <span style={{
                display: 'block',
                height: '100%',
                width: `${progress}%`,
                background: '#10b981',
                transition: 'width 60ms linear',
              }} />
            </span>
            <span>{progress}%</span>
          </p>
        )}

        {greetingText && (
          <p style={{
            color: '#6ee7b7',
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontWeight: 600,
            margin: '22px 0 0 0',
            lineHeight: 1.4,
          }}>
            {greetingText}
            {greetingText.length < greeting.length && (
              <span className="intro-cursor">▋</span>
            )}
          </p>
        )}
      </div>

      <style>{`
        .intro-cursor {
          display: inline-block;
          animation: intro-blink 1s step-end infinite;
          margin-left: 1px;
        }
        @keyframes intro-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const lineStyle: React.CSSProperties = {
  color: '#10b981',
  fontSize: 'clamp(12px, 1.5vw, 15px)',
  lineHeight: 1.85,
  margin: 0,
};
