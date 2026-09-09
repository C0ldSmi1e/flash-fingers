"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  shells: number;
  sparks: number;
  durationMs: number;
}

const COLORS = [
  "#ff4d6d",
  "#ffb703",
  "#ffe066",
  "#4cc9f0",
  "#80ed99",
  "#b5179e",
  "#ff7b00",
];
const LAUNCH_MS = 550;
const STAGGER_MS = 350;

interface Spark {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  bornAt: number;
  life: number;
  color: string;
  size: number;
}

// Rockets rise from the bottom, burst into colored sparks with trails.
const Fireworks = ({ shells, sparks, durationMs }: FireworksProps) => {
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

    const start = performance.now();
    const rockets = Array.from({ length: shells }, (_, i) => ({
      x: W * (0.3 + Math.random() * 0.4),
      targetY: H * (0.22 + Math.random() * 0.25),
      launchAt: start + i * STAGGER_MS,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      exploded: false,
    }));
    const live: Spark[] = [];

    const explode = (x: number, y: number, color: string, now: number) => {
      for (let i = 0; i < sparks; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 6;
        live.push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          bornAt: now,
          life: 900 + Math.random() * 600,
          color: Math.random() < 0.2 ? "#ffffff" : color,
          size: 1.5 + Math.random() * 1.5,
        });
      }
    };

    let frame = 0;
    const tick = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (now - start >= durationMs) {
        return;
      }

      for (const r of rockets) {
        if (r.exploded || now < r.launchAt) continue;
        const p = Math.min(1, (now - r.launchAt) / LAUNCH_MS);
        const eased = 1 - (1 - p) * (1 - p);
        const y = H - (H - r.targetY) * eased;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(r.x, y + 18);
        ctx.lineTo(r.x, y);
        ctx.stroke();
        if (p >= 1) {
          r.exploded = true;
          explode(r.x, r.targetY, r.color, now);
        }
      }

      ctx.lineCap = "round";
      for (let i = live.length - 1; i >= 0; i--) {
        const s = live[i];
        const age = (now - s.bornAt) / s.life;
        if (age >= 1) {
          live.splice(i, 1);
          continue;
        }
        s.px = s.x;
        s.py = s.y;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.07;
        s.vx *= 0.98;
        s.vy *= 0.98;
        ctx.globalAlpha = 1 - age * age;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [shells, sparks, durationMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
    />
  );
};

export { Fireworks };
