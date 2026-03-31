'use client';

import { useEffect, useRef } from 'react';

const FONT_SIZE = 13;
const MAX_CONTENT_WIDTH = 768; // max-w-3xl in px
const INFLUENCE_RADIUS = 140; // horizontal distance only
const TRAIL_LENGTH = 18;
const BASE_SPEED_MIN = 0.15;
const BASE_SPEED_MAX = 0.35;

export function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let animId: number;

    function calcWidth() {
      return Math.max(0, Math.floor((window.innerWidth - MAX_CONTENT_WIDTH) / 2));
    }

    function getBgColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-bg')
        .trim() || '#0d0d0b';
    }

    function init() {
      if (!canvas || !ctx) return;
      const w = calcWidth();
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // Fill with bg color immediately so canvas isn't transparent on mount
      ctx.fillStyle = getBgColor();
      ctx.fillRect(0, 0, w, h);
      cols = Math.floor(w / FONT_SIZE);
      drops = Array.from({ length: cols }, () => -(Math.random() * 30));
      speeds = Array.from(
        { length: cols },
        () => BASE_SPEED_MIN + Math.random() * (BASE_SPEED_MAX - BASE_SPEED_MIN)
      );
    }

    init();
    window.addEventListener('resize', init);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      if (w < 4) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Clear each frame with the actual page bg color — no accumulated tint
      ctx.fillStyle = getBgColor();
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';

      const { x: mx } = mouseRef.current;

      for (let i = 0; i < cols; i++) {
        const colX = i * FONT_SIZE + FONT_SIZE / 2;

        // Horizontal distance only — entire column lights up, not a bubble
        const dist = Math.abs(colX - mx);
        const influence = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
        const speed = speeds[i] * (1 + influence * 4);

        const leadRow = Math.floor(drops[i]);

        // Draw trail from leading char upward
        for (let t = 0; t < TRAIL_LENGTH; t++) {
          const row = leadRow - t;
          const y = row * FONT_SIZE;
          if (y < -FONT_SIZE || y > h) continue;

          const char = Math.random() > 0.5 ? '1' : '0';
          const fade = 1 - t / TRAIL_LENGTH;

          if (t === 0) {
            // Leading character: brightest
            if (influence > 0.5) {
              ctx.fillStyle = `rgba(210, 255, 230, ${0.6 + influence * 0.4})`;
            } else {
              ctx.fillStyle = `rgba(16, 185, 129, ${0.55 + influence * 0.3})`;
            }
          } else {
            // Trail: fade with influence boost
            const base = 0.06 + influence * 0.18;
            ctx.fillStyle = `rgba(16, 185, 129, ${base * fade})`;
          }

          ctx.fillText(char, colX, y);
        }

        drops[i] += speed;

        if (drops[i] * FONT_SIZE > h + TRAIL_LENGTH * FONT_SIZE) {
          drops[i] = -(Math.random() * 25);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
