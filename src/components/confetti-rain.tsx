"use client";

import { useEffect, useRef } from "react";

interface ConfettiRainProps {
  count: number;
  durationMs: number;
}

const COLORS = [
  "#ff4d6d",
  "#ff7b00",
  "#ffd60a",
  "#4cc9f0",
  "#80ed99",
  "#b5179e",
  "#ff8fab",
  "#00b4d8",
];
const FADE_MS = 800;

// Confetti and ribbons fall from the top with flutter and sway.
const ConfettiRain = ({ count, durationMs }: ConfettiRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const pieces = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.8,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      vy: 2.5 + Math.random() * 3,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 20 + Math.random() * 30,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      flip: Math.random() * Math.PI,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      ribbon: Math.random() < 0.25,
    }));

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);
      if (elapsed >= durationMs) {
        return;
      }
      const t = elapsed / 1000;
      const fade = Math.min(1, (durationMs - elapsed) / FADE_MS);

      for (const p of pieces) {
        p.y += p.vy;
        p.rot += p.vr;
        p.flip += 0.12;
        if (p.y > H + 30) continue;
        const x = p.x + Math.sin(t * 2 + p.sway) * p.swayAmp;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(Math.cos(p.flip) * 0.9 + 0.1, 1);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        if (p.ribbon) {
          ctx.fillRect(-p.w / 4, -p.h * 1.6, p.w / 2, p.h * 3.2);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [count, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
    />
  );
};

export { ConfettiRain };
