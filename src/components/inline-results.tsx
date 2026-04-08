"use client";

import { Performance } from "@/types/performance";

interface InlineResultsProps {
  performance: Performance;
  isPersonalBest: boolean;
}

const InlineResults = ({ performance, isPersonalBest }: InlineResultsProps) => {
  return (
    <div className="mt-8 text-center animate-fade-slide-up">
      <div className="flex items-center justify-center gap-4 text-lg font-mono">
        <span className="correct-text font-semibold text-2xl">
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

      {isPersonalBest && (
        <p className="correct-text text-sm mt-3 font-medium">
          New personal best!
        </p>
      )}

      <p className="default-text text-sm mt-4 animate-pulse opacity-60">
        press any key to continue
      </p>
    </div>
  );
};

export { InlineResults };
