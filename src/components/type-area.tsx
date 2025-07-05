"use client";

import { useEffect, useState } from "react";
import { Input } from "@/types/input";
import { Round } from "@/types/round";
import { Progress } from "@/types/progress";
import { Performance } from "@/types/performance";
import { TypingText } from "@/components/typing-text";
import { ResultsModal } from "@/components/results-modal";
import { TypingInput } from "@/components/typing-input";

interface TypeAreaProps {
  round: Round;
  input: Input;
  setInput: (input: Input) => void;
  gameProgress: Progress;
  onTypingStart: () => void;
  onCompletion: (performance: Performance) => void;
  onRestart: () => void;
}

const TypeArea = ({ round, input, setInput, gameProgress, onTypingStart, onCompletion, onRestart }: TypeAreaProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [bestPaceIndex, setBestPaceIndex] = useState(-1);
  const [typingStartTime, setTypingStartTime] = useState<Date | null>(null);
  const [currentTargetWpm, setCurrentTargetWpm] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (round.isCompleted) {
        e.preventDefault();
        e.stopPropagation();
        setIsTyping(false);
        setTypingStartTime(null);
        onRestart();
      }
    };

    if (round.isCompleted) {
      window.addEventListener("keydown", handleKeyPress, true);
      return () => window.removeEventListener("keydown", handleKeyPress, true);
    }
  }, [round.isCompleted, onRestart]);

  // Auto-update pace indicator smoothly
  useEffect(() => {
    if (!isTyping || round.isCompleted || !gameProgress || !typingStartTime) {
      setBestPaceIndex(-1);
      return;
    }

    const effectiveWpm = gameProgress.averageWpm > 0 
      ? (gameProgress.averageWpm * 0.7 + gameProgress.bestWpm * 0.3) 
      : 30;

    const interval = setInterval(() => {
      const currentTime = (Date.now() - typingStartTime.getTime()) / 1000;
      const bestPaceChars = Math.min((currentTime * effectiveWpm * 5) / 60, round.content.text.length);
      setBestPaceIndex(Math.ceil(bestPaceChars));
    }, 50); // Update every 50ms for smoother animation

    return () => clearInterval(interval);
  }, [isTyping, round.isCompleted, gameProgress, typingStartTime, round.content.text.length, input.currentText.length]);


  const calculatePerformance = (typedText: string, totalTypedCount: number): Performance => {
    const totalTime = typingStartTime ? (Date.now() - typingStartTime.getTime()) / 1000 : 0;
    const correctChars = round.content.text.split("").filter(
      (char, index) => char === typedText[index]
    ).length;
    const accuracy = totalTypedCount > 0 ? Math.round((correctChars / totalTypedCount) * 100) : 0;
    const wordsTyped = correctChars / 5; // Standard: 5 characters per word
    const wpm = totalTime > 0 ? Math.round((wordsTyped / totalTime) * 60) : 0;

    // Determine winner using hybrid approach
    const wpmDifference = Math.abs(wpm - currentTargetWpm);
    const isWpmClose = wpmDifference <= 2; // Within 2 WPM considered close
    
    let wonAgainstTarget: boolean;
    if (isWpmClose) {
      // Tiebreaker: position-based comparison
      wonAgainstTarget = typedText.length >= bestPaceIndex;
    } else {
      // Primary: WPM comparison
      wonAgainstTarget = wpm > currentTargetWpm;
    }

    return {
      typedCount: totalTypedCount,
      charCount: correctChars,
      wordCount: Math.floor(wordsTyped),
      totalTime,
      wpm,
      accuracy,
      targetWpm: currentTargetWpm,
      wonAgainstTarget,
      finalUserPosition: typedText.length,
      finalTargetPosition: bestPaceIndex,
    };
  };

  const handleTypingStart = () => {
    onTypingStart();
    setIsTyping(true);
    if (!typingStartTime) {
      setTypingStartTime(new Date());
    }
    
    // Set target WPM for this round
    const targetWpm = gameProgress.averageWpm > 0 
      ? (gameProgress.averageWpm * 0.7 + gameProgress.bestWpm * 0.3) 
      : 30;
    setCurrentTargetWpm(targetWpm);
  };

  const handleInputChange = (newText: string, lengthDiff: number) => {
    // Check for completion
    if (newText.length === round.content.text.length) {
      const isComplete = round.content.text.split("").every((char, index) => char === newText[index]);
      if (isComplete) {
        setIsTyping(false);
        setTypingStartTime(null);
        const newTypedCount = lengthDiff === 1 ? input.typedCount + 1 : input.typedCount;
        const finalPerformance = calculatePerformance(newText, newTypedCount);
        onCompletion(finalPerformance);
      }
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
      <TypingText 
        content={round.content.text}
        currentText={input.currentText}
        bestPaceIndex={bestPaceIndex}
        isCompleted={round.isCompleted}
      />
      
      <TypingInput 
        input={input}
        setInput={setInput}
        isCompleted={round.isCompleted}
        onTypingStart={handleTypingStart}
        onInputChange={handleInputChange}
      />
      
      {/* Show prompt before user starts typing */}
      {!isTyping && !round.isCompleted && input.currentText.length === 0 && (
        <div className="mt-6 text-center">
          <p className="default-text text-lg animate-pulse">
            Start typing to begin!
          </p>
        </div>
      )}
      
      {round.isCompleted && (
        <ResultsModal 
          round={round}
          gameProgress={gameProgress}
        />
      )}
    </div>
  );
};

export { TypeArea };