"use client";

import Link from "next/link";
import { Performance } from "@/src/schemas/performance";
import { ConfettiRain } from "@/src/components/confetti-rain";

interface InlineResultsProps {
  performance: Performance;
  isPersonalBest: boolean;
  vsAvg: number | null;
  showSignUp: boolean;
}

const InlineResults = ({
  performance,
  isPersonalBest,
  vsAvg,
  showSignUp,
}: InlineResultsProps) => {
  // Two tiers: beating your average is the everyday win, a personal best is rarer.
  const beatAvg = !isPersonalBest && vsAvg !== null && vsAvg > 0;
  const pop = isPersonalBest ? "animate-pb-pop" : beatAvg ? "animate-avg-pop" : "";

  return (
    <>
      {isPersonalBest && <ConfettiRain count={320} durationMs={4200} />}
      {beatAvg && <ConfettiRain count={120} durationMs={2600} />}

      <div className="mt-8 text-center animate-fade-slide-up">
        <div className="flex items-center justify-center gap-4 text-lg font-mono">
          <span className={`correct-text font-semibold text-2xl ${pop}`}>
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
            <p className="correct-text text-sm mt-3 font-medium animate-fade-slide-up">
              New personal best!
            </p>
          </>
        )}

        {/* Click-only: any key starts the next round. */}
        {showSignUp && (
          <div className="mt-4">
            <Link
              href="/sign-in"
              className="text-xs font-mono default-text opacity-50 hover:opacity-100 transition-opacity underline underline-offset-4"
            >
              sign up to save your rounds and join the leaderboard
            </Link>
          </div>
        )}

        <p className="default-text text-sm mt-3 animate-pulse opacity-60">
          press any key to continue
        </p>
      </div>
    </>
  );
};

export { InlineResults };
