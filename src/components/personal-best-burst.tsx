"use client";

import { useEffect, useRef } from "react";

const COUNT = 90;
const DURATION_MS = 1500;

// One-shot particle burst in the app palette. Unmounts with the results.
const PersonalBestBurst = () => {
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

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const style = getComputedStyle(document.documentElement);
    const colors = [
      "--color-correct-text",
      "--color-cursor",
      "--color-default-text",
    ].map((name) => style.getPropertyValue(name).trim());

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const particles = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        spin: Math.random() * Math.PI,
      };
    });

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = (now - start) / DURATION_MS;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (t >= 1) {
        return;
      }
      ctx.globalAlpha = 1 - t * t;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.985;
        p.spin += 0.1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
    />
  );
};

export { PersonalBestBurst };
