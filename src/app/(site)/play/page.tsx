"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/utils/api";
import { stats } from "@/src/config/constants";
import { Content } from "@/src/schemas/content";
import { Input } from "@/src/schemas/input";
import { Round } from "@/src/schemas/round";
import { Performance } from "@/src/schemas/performance";
import { UserStats } from "@/src/schemas/stats";
import { TypeArea } from "@/src/components/type-area";
import { useIsDesktop } from "@/src/hooks/use-is-desktop";
import { useSession } from "@/src/utils/auth-client";

const PlayPage = () => {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [input, setInput] = useState<Input>({ currentText: "", typedCount: 0 });
  const [avgWpm, setAvgWpm] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [recentWpms, setRecentWpms] = useState<number[]>([]);
  const [vsAvg, setVsAvg] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const isDesktop = useIsDesktop();
  const { data: session } = useSession();

  const createNewRound = async () => {
    try {
      setIsLoading(true);
      const [content] = await api<Content[]>("/api/content", {
        cache: "no-store",
      });
      setCurrentRound({ isCompleted: false, performance: null, content });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const me = await api<UserStats>("/api/me", { cache: "no-store" });
      setAvgWpm(me.avgWpm);
      setBestWpm(me.bestWpm);
    } catch (error) {
      console.error(error);
    }
  };

  const saveRecord = async (round: Round, performance: Performance) => {
    try {
      await api("/api/records", {
        method: "POST",
        body: JSON.stringify({
          contentId: round.content.id,
          typedCount: performance.typedCount,
          startedAt: performance.startedAt,
          endedAt: performance.endedAt,
        }),
      });
      // Next round's ghost paces at the updated average.
      await loadStats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompletion = (finalPerformance: Performance) => {
    if (!currentRound) {
      return;
    }

    // Compare against the average you were actually racing.
    setVsAvg(avgWpm > 0 ? finalPerformance.wpm - avgWpm : null);
    setIsPersonalBest(finalPerformance.wpm > bestWpm);
    setBestWpm((prev) => Math.max(prev, finalPerformance.wpm));

    if (session) {
      saveRecord(currentRound, finalPerformance);
    } else {
      // Anonymous play is not saved; keep a session-local window instead.
      const recent = [...recentWpms, finalPerformance.wpm].slice(-stats.window);
      setRecentWpms(recent);
      setAvgWpm(Math.round(recent.reduce((sum, w) => sum + w, 0) / recent.length));
    }

    setCurrentRound({
      ...currentRound,
      isCompleted: true,
      performance: finalPerformance,
    });
  };

  const handleRestart = () => {
    setIsPersonalBest(false);
    setVsAvg(null);
    setInput({ currentText: "", typedCount: 0 });
    createNewRound();
  };

  useEffect(() => {
    createNewRound();
  }, []);

  useEffect(() => {
    if (session) {
      loadStats();
    }
  }, [session]);

  if (isDesktop === null) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-screen gap-3 px-6 text-center">
        <p className="default-text text-xl font-mono">Desktop only</p>
        <p className="default-text opacity-60">
          Flash Fingers needs a physical keyboard. Please visit on a desktop.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentRound) {
    return <div>No game found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen relative">
      <TypeArea
        round={currentRound}
        input={input}
        setInput={setInput}
        targetWpm={avgWpm}
        isPersonalBest={isPersonalBest}
        vsAvg={vsAvg}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default PlayPage;
