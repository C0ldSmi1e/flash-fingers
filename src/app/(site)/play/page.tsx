"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/utils/api";
import { Content } from "@/src/schemas/content";
import { Input } from "@/src/schemas/input";
import { Round } from "@/src/schemas/round";
import { Game } from "@/src/schemas/game";
import { Progress } from "@/src/schemas/progress";
import { Performance } from "@/src/schemas/performance";
import { TypeArea } from "@/src/components/type-area";
import { useIsDesktop } from "@/src/hooks/use-is-desktop";
import { useSession } from "@/src/utils/auth-client";

const PlayPage = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [input, setInput] = useState<Input>({
    currentText: "",
    typedCount: 0,
    wordCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalBest, setIsPersonalBest] = useState(false);
  const isDesktop = useIsDesktop();
  const { data: session } = useSession();

  const initializeGame = () => {
    const newGame: Game = {
      id: crypto.randomUUID(),
      startedAt: new Date(),
      rounds: [],
      progress: {
        totalRounds: 0,
        totalTime: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
        bestAccuracy: 0,
      },
    };
    setGame(newGame);
  };

  const createNewRound = async () => {
    try {
      setIsLoading(true);
      const [content] = await api<Content[]>("/api/content", {
        cache: "no-store",
      });
      const newRound: Round = {
        id: crypto.randomUUID(),
        startTime: new Date(),
        endTime: null,
        isCompleted: false,
        performance: null,
        content,
      };
      setCurrentRound(newRound);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (completedRounds: Round[]): Progress => {
    if (completedRounds.length === 0) {
      return {
        totalRounds: 0,
        totalTime: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
        bestAccuracy: 0,
      };
    }

    const totalTime = completedRounds.reduce(
      (sum, round) => sum + (round.performance?.totalTime || 0),
      0,
    );
    const averageWpm =
      completedRounds.reduce(
        (sum, round) => sum + (round.performance?.wpm || 0),
        0,
      ) / completedRounds.length;
    const averageAccuracy =
      completedRounds.reduce(
        (sum, round) => sum + (round.performance?.accuracy || 0),
        0,
      ) / completedRounds.length;
    const bestWpm = Math.max(
      ...completedRounds.map((round) => round.performance?.wpm || 0),
    );
    const bestAccuracy = Math.max(
      ...completedRounds.map((round) => round.performance?.accuracy || 0),
    );

    return {
      totalRounds: completedRounds.length,
      totalTime,
      averageWpm: Math.round(averageWpm),
      averageAccuracy: Math.round(averageAccuracy),
      bestWpm,
      bestAccuracy,
    };
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
    if (currentRound && game) {
      setIsPersonalBest(finalPerformance.wpm > game.progress.bestWpm);

      // Signed-in players get the round persisted; anonymous play is not saved.
      if (session) {
        saveRecord(currentRound, finalPerformance);
      }

      const completedRound: Round = {
        ...currentRound,
        endTime: new Date(),
        isCompleted: true,
        performance: finalPerformance,
      };

      const updatedRounds = [...game.rounds, completedRound];
      const updatedProgress = calculateProgress(updatedRounds);

      setGame((prev) =>
        prev
          ? {
              ...prev,
              rounds: updatedRounds,
              progress: updatedProgress,
            }
          : null,
      );

      setCurrentRound(completedRound);
    }
  };

  const handleRestart = () => {
    setIsPersonalBest(false);
    setInput({
      currentText: "",
      typedCount: 0,
      wordCount: 0,
    });
    createNewRound();
  };

  // Initialize game and first round on mount
  useEffect(() => {
    if (!game) {
      initializeGame();
    }
    if (!currentRound && game) {
      createNewRound();
    }
  }, [game, currentRound]);

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

  if (!game || !currentRound) {
    return <div>No game found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen relative">
      <TypeArea
        round={currentRound}
        input={input}
        setInput={setInput}
        bestWpm={game.progress.bestWpm}
        isPersonalBest={isPersonalBest}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default PlayPage;
