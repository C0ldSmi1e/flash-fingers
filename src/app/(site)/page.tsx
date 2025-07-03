"use client";

import { useState, useEffect } from "react";
import { getContent } from "@/app/actions/client/get-content";
import { Input } from "@/types/input";
import { Round } from "@/types/round";
import { Game } from "@/types/game";
import { Progress } from "@/types/progress";
import { Performance } from "@/types/performance";
import { TypeArea } from "@/app/components/type-area";

const HomePage = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [input, setInput] = useState<Input>({
    currentText: "",
    typedCount: 0,
    wordCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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
      const content = await getContent();
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

  const handleTypingStart = () => {
    if (currentRound && !currentRound.startTime) {
      setCurrentRound(prev => prev ? ({
        ...prev,
        startTime: new Date(),
      }) : null);
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

    const totalTime = completedRounds.reduce((sum, round) => sum + (round.performance?.totalTime || 0), 0);
    const averageWpm = completedRounds.reduce((sum, round) => sum + (round.performance?.wpm || 0), 0) / completedRounds.length;
    const averageAccuracy = completedRounds.reduce((sum, round) => sum + (round.performance?.accuracy || 0), 0) / completedRounds.length;
    const bestWpm = Math.max(...completedRounds.map(round => round.performance?.wpm || 0));
    const bestAccuracy = Math.max(...completedRounds.map(round => round.performance?.accuracy || 0));

    return {
      totalRounds: completedRounds.length,
      totalTime,
      averageWpm: Math.round(averageWpm),
      averageAccuracy: Math.round(averageAccuracy),
      bestWpm,
      bestAccuracy,
    };
  };

  const handleCompletion = (finalPerformance: Performance) => {
    if (currentRound && game) {
      const completedRound: Round = {
        ...currentRound,
        endTime: new Date(),
        isCompleted: true,
        performance: finalPerformance,
      };
      
      const updatedRounds = [...game.rounds, completedRound];
      const updatedProgress = calculateProgress(updatedRounds);
      
      setGame(prev => prev ? ({
        ...prev,
        rounds: updatedRounds,
        progress: updatedProgress,
      }) : null);
      
      setCurrentRound(completedRound);
    }
  };

  const handleRestart = () => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!game || !currentRound) {
    return <div>No game found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <TypeArea 
        round={currentRound}
        input={input} 
        setInput={setInput}
        gameProgress={game.progress}
        onTypingStart={handleTypingStart}
        onCompletion={handleCompletion}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default HomePage;