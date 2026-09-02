"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/utils/api";
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
  const [bestWpm, setBestWpm] = useState(0);
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompletion = (finalPerformance: Performance) => {
    if (!currentRound) {
      return;
    }

    setIsPersonalBest(finalPerformance.wpm > bestWpm);
    setBestWpm((prev) => Math.max(prev, finalPerformance.wpm));

    // Signed-in players get the round persisted; anonymous play is not saved.
    if (session) {
      saveRecord(currentRound, finalPerformance);
    }

    setCurrentRound({
      ...currentRound,
      isCompleted: true,
      performance: finalPerformance,
    });
  };

  const handleRestart = () => {
    setIsPersonalBest(false);
    setInput({ currentText: "", typedCount: 0 });
    createNewRound();
  };

  useEffect(() => {
    createNewRound();
  }, []);

  // Signed-in players pace the ghost against their all-time best.
  useEffect(() => {
    if (!session) {
      return;
    }
    const loadStats = async () => {
      try {
        const stats = await api<UserStats>("/api/me", { cache: "no-store" });
        setBestWpm((prev) => Math.max(prev, stats.bestWpm));
      } catch (error) {
        console.error(error);
      }
    };
    loadStats();
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
        bestWpm={bestWpm}
        isPersonalBest={isPersonalBest}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default PlayPage;
