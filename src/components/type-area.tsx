"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/types/input";
import { Round } from "@/types/round";
import { Performance } from "@/types/performance";
import { TypingText } from "@/components/typing-text";
import { InlineResults } from "@/components/inline-results";
import { TypingInput } from "@/components/typing-input";

interface TypeAreaProps {
  round: Round;
  input: Input;
  setInput: (input: Input) => void;
  bestWpm: number;
  isPersonalBest: boolean;
  onTypingStart: () => void;
  onCompletion: (performance: Performance) => void;
  onRestart: () => void;
}

const TypeArea = ({
  round,
  input,
  setInput,
  bestWpm,
  isPersonalBest,
  onTypingStart,
  onCompletion,
  onRestart,
}: TypeAreaProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingStartTime, setTypingStartTime] = useState<Date | null>(null);
  const [liveWpm, setLiveWpm] = useState(0);
  const [ghostIndex, setGhostIndex] = useState(-1);
  const textLengthRef = useRef(0);
  textLengthRef.current = input.currentText.length;

  const resetTypingState = useCallback(() => {
    setIsTyping(false);
    setTypingStartTime(null);
    setLiveWpm(0);
    setGhostIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (round.isCompleted) {
        e.preventDefault();
        e.stopPropagation();
        resetTypingState();
        onRestart();
      }
    };

    if (round.isCompleted) {
      window.addEventListener("keydown", handleKeyPress, true);
      return () => window.removeEventListener("keydown", handleKeyPress, true);
    }
  }, [round.isCompleted, onRestart, resetTypingState]);

  useEffect(() => {
    if (!isTyping || round.isCompleted || !typingStartTime) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - typingStartTime.getTime()) / 1000;
      if (elapsed > 0.5) {
        setLiveWpm(Math.round((textLengthRef.current / 5 / elapsed) * 60));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping, round.isCompleted, typingStartTime]);

  // Ghost cursor — moves through text at your personal best pace
  useEffect(() => {
    if (!isTyping || round.isCompleted || !typingStartTime || bestWpm <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - typingStartTime.getTime()) / 1000;
      const ghostChars = Math.min(
        Math.ceil((elapsed * bestWpm * 5) / 60),
        round.content.text.length,
      );
      setGhostIndex(ghostChars);
    }, 50);

    return () => clearInterval(interval);
  }, [isTyping, round.isCompleted, typingStartTime, bestWpm, round.content.text.length]);

  const calculatePerformance = (
    typedText: string,
    totalTypedCount: number,
  ): Performance => {
    const totalTime = typingStartTime
      ? (Date.now() - typingStartTime.getTime()) / 1000
      : 0;
    const correctChars = round.content.text
      .split("")
      .filter((char, index) => char === typedText[index]).length;
    const accuracy =
      totalTypedCount > 0 ? Math.round((correctChars / totalTypedCount) * 100) : 0;
    const wordsTyped = correctChars / 5;
    const wpm = totalTime > 0 ? Math.round((wordsTyped / totalTime) * 60) : 0;

    return {
      typedCount: totalTypedCount,
      charCount: correctChars,
      wordCount: Math.floor(wordsTyped),
      totalTime,
      wpm,
      accuracy,
    };
  };

  const handleTypingStart = () => {
    onTypingStart();
    setIsTyping(true);
    if (!typingStartTime) {
      setTypingStartTime(new Date());
    }
  };

  const handleInputChange = (newText: string, lengthDiff: number) => {
    // Check for completion
    if (newText.length === round.content.text.length) {
      const isComplete = round.content.text
        .split("")
        .every((char, index) => char === newText[index]);
      if (isComplete) {
        resetTypingState();
        const newTypedCount =
          lengthDiff === 1 ? input.typedCount + 1 : input.typedCount;
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
        ghostIndex={ghostIndex}
        isCompleted={round.isCompleted}
      />

      <TypingInput
        input={input}
        setInput={setInput}
        isCompleted={round.isCompleted}
        onTypingStart={handleTypingStart}
        onInputChange={handleInputChange}
      />

      {!isTyping && !round.isCompleted && input.currentText.length === 0 && (
        <div className="mt-6 text-center">
          <p className="default-text text-lg animate-pulse">
            Start typing to begin
          </p>
        </div>
      )}

      {isTyping && !round.isCompleted && liveWpm > 0 && (
        <div className="mt-6 text-center">
          <span
            className={`text-4xl font-mono font-light opacity-50 ${liveWpm >= bestWpm && bestWpm > 0 ? "correct-text" : "default-text"}`}
          >
            {liveWpm}
          </span>
          <span className="text-sm default-text opacity-30 ml-2">wpm</span>
        </div>
      )}

      {round.isCompleted && round.performance && (
        <InlineResults
          performance={round.performance}
          isPersonalBest={isPersonalBest}
        />
      )}
    </div>
  );
};

export { TypeArea };
