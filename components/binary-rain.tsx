'use client';

import { useEffect, useRef } from 'react';

const FONT_SIZE = 13;
const MAX_CONTENT_WIDTH = 768; // max-w-3xl in px
const INFLUENCE_RADIUS = 160;
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

    function init() {
      const w = calcWidth();
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      cols = Math.floor(w / FONT_SIZE);
      drops = Array.from({ length: cols }, () => -(Math.random() * (h / FONT_SIZE)));
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

    // Get background color from CSS variable for correct fade
    function getBgColor() {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--color-bg').trim() || '#0d0d0b';
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      if (w < 4) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Fade previous frame — alpha controls trail length
      ctx.fillStyle = `rgba(13, 13, 11, 0.055)`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';

      const { x: mx, y: my } = mouseRef.current;

      for (let i = 0; i < cols; i++) {
        const colX = i * FONT_SIZE + FONT_SIZE / 2;
        const dist = Math.hypot(colX - mx, drops[i] * FONT_SIZE - my);
        const influence = Math.max(0, 1 - dist / INFLUENCE_RADIUS);

        // Speed up near cursor
        const speed = speeds[i] * (1 + influence * 5);

        const y = drops[i] * FONT_SIZE;
        const char = Math.random() > 0.5 ? '1' : '0';

        // Color: white-green at high influence, dim green at low
        if (influence > 0.6) {
          ctx.fillStyle = `rgba(210, 255, 235, ${0.5 + influence * 0.5})`;
        } else if (influence > 0.1) {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + influence * 0.7})`;
        } else {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
        }

        ctx.fillText(char, colX, y);

        drops[i] += speed;

        if (drops[i] * FONT_SIZE > h && Math.random() > 0.975) {
          drops[i] = -(Math.random() * 25);
        }
      }

      // Radial glow at cursor position (only when inside canvas bounds)
      if (mx >= 0 && mx < w) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, INFLUENCE_RADIUS);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.07)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
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
