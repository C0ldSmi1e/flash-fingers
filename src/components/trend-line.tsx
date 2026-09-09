"use client";

import { useState } from "react";

interface TrendLineProps {
  values: number[]; // oldest → newest
  avg: number;
}

const W = 420;
const H = 72;
const PAD = 6;

// No axes — the dashed avg is the only reference.
const TrendLine = ({ values, avg }: TrendLineProps) => {
  const [hover, setHover] = useState<number | null>(null);

  if (values.length < 2) {
    return null;
  }

  const yMax = Math.max(avg, ...values) * 1.1;
  const x = (i: number) => PAD + (i / (values.length - 1)) * (W - 2 * PAD);
  const y = (v: number) => PAD + (H - 2 * PAD) - (v / yMax) * (H - 2 * PAD);
  const points = values.map((v, i) => [x(i), y(v)] as const);
  const path = points
    .map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`)
    .join(" ");
  const [lastX, lastY] = points[points.length - 1];

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD) / (W - 2 * PAD)) * (values.length - 1));
    setHover(Math.max(0, Math.min(values.length - 1, i)));
  };

  const delta = hover === null ? 0 : values[hover] - avg;

  return (
    <div className="relative w-full max-w-[420px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block overflow-visible"
        role="img"
        aria-label="Round wpm trend"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <line
          x1={PAD}
          x2={W - PAD}
          y1={y(avg)}
          y2={y(avg)}
          stroke="var(--color-correct-text)"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity=".5"
        />
        <path
          d={path}
          fill="none"
          stroke="var(--color-default-text)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity=".8"
        />
        <circle cx={lastX} cy={lastY} r="3.5" fill="var(--color-correct-text)" />
        {hover !== null && (
          <circle
            cx={points[hover][0]}
            cy={points[hover][1]}
            r="3.5"
            fill="var(--color-default-text)"
          />
        )}
      </svg>
      {hover !== null && (
        <span
          className="absolute pointer-events-none font-mono text-xs default-text whitespace-nowrap -translate-x-1/2 -translate-y-[140%]"
          style={{
            left: `${(points[hover][0] / W) * 100}%`,
            top: `${(points[hover][1] / H) * 100}%`,
          }}
        >
          {values[hover]} wpm {delta >= 0 ? "+" : ""}
          {delta}
        </span>
      )}
    </div>
  );
};

export { TrendLine };
