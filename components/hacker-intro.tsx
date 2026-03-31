'use client';

import { useEffect, useState } from 'react';

const BOOT_SEQUENCE = [
  { text: '> ssh matt@blanke.dev',               pauseAfter: 420 },
  { text: '> Connection established.',            pauseAfter: 220 },
  { text: '> Authenticating... ACCESS GRANTED',   pauseAfter: 260 },
  { text: '> Scanning portfolio directory...',    pauseAfter: 180 },
  { text: '> Projects located: 12',              pauseAfter: 140 },
  { text: '> Experience logs: 4 entries',         pauseAfter: 140 },
  { text: '> Compiling interface... DONE',        pauseAfter: 320 },
];

const CHAR_SPEED = 24;

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export function HackerIntro() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'progress' | 'greeting'>('typing');
  const [greetingText, setGreetingText] = useState('');
  const [fading, setFading] = useState(false);

  // Check sessionStorage — only show once per session
  useEffect(() => {
    const seen = sessionStorage.getItem('hacker-intro-seen');
    setShouldShow(!seen);
  }, []);

  // Orchestrate the sequence
  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;

    async function run() {
      await sleep(300);

      // Phase 1: type each boot line
      for (const { text, pauseAfter } of BOOT_SEQUENCE) {
        if (cancelled) return;
        for (let i = 1; i <= text.length; i++) {
          if (cancelled) return;
          setCurrentLine(text.slice(0, i));
          await sleep(CHAR_SPEED + Math.random() * 14);
        }
        if (cancelled) return;
        setCompletedLines((prev) => [...prev, text]);
        setCurrentLine('');
        await sleep(pauseAfter);
      }

      if (cancelled) return;

      // Phase 2: progress bar
      setPhase('progress');
      const STEPS = 80;
      const DURATION = 1600;
      for (let step = 1; step <= STEPS; step++) {
        if (cancelled) return;
        await sleep(DURATION / STEPS);
        setProgress(Math.round((step / STEPS) * 100));
      }

      await sleep(350);
      if (cancelled) return;

      // Phase 3: greeting
      setPhase('greeting');
      const greeting = getGreeting();
      await sleep(180);
      for (let i = 1; i <= greeting.length; i++) {
        if (cancelled) return;
        setGreetingText(greeting.slice(0, i));
        await sleep(CHAR_SPEED + 18);
      }

      await sleep(1100);
      if (cancelled) return;

      // Fade out then unmount
      setFading(true);
      await sleep(750);
      if (cancelled) return;
      sessionStorage.setItem('hacker-intro-seen', '1');
      setShouldShow(false);
    }

    run();
    return () => {
      cancelled = true;
    };
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
        transition: 'opacity 0.75s ease',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div>
        {/* Completed boot lines */}
        {completedLines.map((line, i) => (
          <p key={i} style={lineStyle}>
            {line}
          </p>
        ))}

        {/* Currently-typing line with blinking cursor */}
        {currentLine && (
          <p style={lineStyle}>
            {currentLine}
            <span className="intro-cursor">▋</span>
          </p>
        )}

        {/* Progress bar line */}
        {phase === 'progress' && (
          <p style={{ ...lineStyle, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span>&gt; Initializing portfolio...</span>
            <span
              style={{
                display: 'inline-block',
                border: '1px solid #10b981',
                width: '120px',
                height: '13px',
                verticalAlign: 'middle',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${progress}%`,
                  background: '#10b981',
                  transition: 'width 22ms linear',
                }}
              />
            </span>
            <span>{progress}%</span>
          </p>
        )}

        {/* Greeting */}
        {greetingText && (
          <p
            style={{
              color: '#6ee7b7',
              fontSize: 'clamp(18px, 2.5vw, 26px)',
              fontWeight: 600,
              margin: '22px 0 0 0',
              lineHeight: 1.4,
            }}
          >
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
