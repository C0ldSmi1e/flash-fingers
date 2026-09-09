"use client";

import { Performance } from "@/src/schemas/performance";
import { PersonalBestBurst } from "@/src/components/personal-best-burst";

interface InlineResultsProps {
  performance: Performance;
  isPersonalBest: boolean;
  vsAvg: number | null;
}

const InlineResults = ({
  performance,
  isPersonalBest,
  vsAvg,
}: InlineResultsProps) => {
  return (
    <div className="mt-8 text-center animate-fade-slide-up">
      <div className="flex items-center justify-center gap-4 text-lg font-mono">
        <span
          className={`correct-text font-semibold text-2xl ${isPersonalBest ? "animate-pb-pop" : ""}`}
        >
          {performance.wpm}
          <span className="text-sm ml-1 opacity-70">wpm</span>
        </span>
        <span className="default-text opacity-30">·</span>
        <span className="default-text">
          {performance.accuracy}
          <span className="text-sm ml-0.5 opacity-70">%</span>
        </span>
        <span className="default-text opacity-30">·</span>
        <span className="default-text">
          {performance.totalTime.toFixed(1)}
          <span className="text-sm ml-0.5 opacity-70">s</span>
        </span>
      </div>

      {vsAvg !== null && (
        <p
          className={`text-sm mt-3 ${vsAvg >= 0 ? "correct-text" : "default-text opacity-70"}`}
        >
          {vsAvg >= 0 ? "+" : ""}
          {vsAvg} vs your avg
        </p>
      )}

      {isPersonalBest && (
        <>
          <PersonalBestBurst />
          <p className="correct-text text-sm mt-3 font-medium animate-fade-slide-up">
            New personal best!
          </p>
        </>
      )}

      <p className="default-text text-sm mt-4 animate-pulse opacity-60">
        press any key to continue
      </p>
    </div>
  );
};

export { InlineResults };
