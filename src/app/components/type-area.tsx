"use client";

import { useRef, useEffect, useState } from "react";
import { Input } from "@/types/input";
import { Round } from "@/types/round";
import { Progress } from "@/types/progress";
import { Performance } from "@/types/performance";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (round.isCompleted) {
        e.preventDefault();
        e.stopPropagation();
        setIsTyping(false);
        onRestart();
      }
    };

    if (round.isCompleted) {
      window.addEventListener("keydown", handleKeyPress, true);
      return () => window.removeEventListener("keydown", handleKeyPress, true);
    }
  }, [round.isCompleted, onRestart]);

  // Auto-update progress bar smoothly
  useEffect(() => {
    if (!isTyping || round.isCompleted || !gameProgress || gameProgress.bestWpm === 0) {
      return;
    }

    const interval = setInterval(() => {
      forceUpdate({}); // Force re-render to update progress bar
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isTyping, round.isCompleted, gameProgress]);


  // Progress bar component
  const renderProgressBar = () => {
    // Only show if game exists and user has a best WPM to chase
    if (!gameProgress || gameProgress.bestWpm === 0 || !isTyping) {
      return null;
    }

    const currentTime = (Date.now() - round.startTime.getTime()) / 1000;
    const totalChars = round.content.text.length;
    
    // Calculate where the "best pace" should be at this time
    const bestPaceChars = Math.min((currentTime * gameProgress.bestWpm * 5) / 60, totalChars);
    const bestPacePercentage = (bestPaceChars / totalChars) * 100;
    
    return (
      <div className="w-full mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Chase Your Best: {gameProgress.bestWpm} WPM
          </span>
          <span className="text-xs text-gray-500">
            Best Pace: {Math.floor(bestPaceChars)}/{totalChars} chars
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          {/* Best pace progress bar */}
          <div 
            className="h-4 rounded-full transition-all duration-200 bg-red-500"
            style={{ width: `${Math.min(bestPacePercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const calculatePerformance = (typedText: string, totalTypedCount: number): Performance => {
    const totalTime = (Date.now() - round.startTime.getTime()) / 1000;
    const correctChars = round.content.text.split("").filter(
      (char, index) => char === typedText[index]
    ).length;
    const accuracy = totalTypedCount > 0 ? Math.round((correctChars / totalTypedCount) * 100) : 0;
    const wordsTyped = correctChars / 5; // Standard: 5 characters per word
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent select all
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      return;
    }
    
    // Prevent word deletion
    if ((e.ctrlKey || e.metaKey) && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
      return;
    }
    
    // Prevent undo/redo
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "y")) {
      e.preventDefault();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const lengthDiff = newText.length - input.currentText.length;
    
    // Only allow single character changes (add one or remove one)
    if (Math.abs(lengthDiff) > 1) {
      // Revert to previous state if multiple characters changed
      e.target.value = input.currentText;
      return;
    }
    
    // Only allow appending at the end or removing from the end
    if (lengthDiff === 1) {
      // Adding one character - must be at the end
      if (!newText.startsWith(input.currentText)) {
        e.target.value = input.currentText;
        return;
      }
    } else if (lengthDiff === -1) {
      // Removing one character - must be from the end
      if (!input.currentText.startsWith(newText)) {
        e.target.value = input.currentText;
        return;
      }
    }
    
    if (newText.length === 1 && input.currentText.length === 0) {
      onTypingStart();
      setIsTyping(true);
    }

    // Update typedCount - increment only when adding characters (not when deleting)
    const newTypedCount = lengthDiff === 1 ? input.typedCount + 1 : input.typedCount;
    
    setInput({ 
      ...input, 
      currentText: newText,
      typedCount: newTypedCount
    });

    // Check for completion
    if (newText.length === round.content.text.length) {
      const isComplete = round.content.text.split("").every((char, index) => char === newText[index]);
      if (isComplete) {
        setIsTyping(false);
        const finalPerformance = calculatePerformance(newText, newTypedCount);
        onCompletion(finalPerformance);
      }
    }
  };

  const renderTypingText = () => {
    // Find first mismatch by comparing each character directly
    let firstMismatchIndex = -1;
    for (let i = 0; i < input.currentText.length; i++) {
      if (round.content.text[i] !== input.currentText[i]) {
        firstMismatchIndex = i;
        break;
      }
    }
    
    return round.content.text.split("").map((char, index) => {
      let className = "transition-colors duration-150";
      
      if (index < input.currentText.length) {
        if (firstMismatchIndex === -1 || index < firstMismatchIndex) {
          className += " text-green-600";
        } else {
          className += " text-red-500";
        }
      } else if (index === input.currentText.length && !round.isCompleted) {
        className += " text-gray-900 bg-blue-200 animate-pulse";
      } else {
        className += " text-gray-400";
      }

      return (
        <span key={index} className={className}>
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  const renderResultsScreen = () => {
    if (!round.performance) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center animate-in fade-in duration-300">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Round {gameProgress.totalRounds + 1} Complete!</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">This Round</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">⏱️ Time:</span>
                  <span className="font-semibold">{round.performance.totalTime.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">🎯 Accuracy:</span>
                  <span className="font-semibold">{round.performance.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">⚡ Speed:</span>
                  <span className="font-semibold">{round.performance.wpm} WPM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">📊 Characters:</span>
                  <span className="font-semibold">{round.performance.charCount}/{round.content.text.length}</span>
                </div>
              </div>
            </div>
            
            {gameProgress.totalRounds > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Game Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">📈 Avg WPM:</span>
                    <span className="font-semibold">{gameProgress.averageWpm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">🏆 Best WPM:</span>
                    <span className="font-semibold">{gameProgress.bestWpm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">🎯 Avg Accuracy:</span>
                    <span className="font-semibold">{gameProgress.averageAccuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">🔥 Total Rounds:</span>
                    <span className="font-semibold">{gameProgress.totalRounds}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-gray-500 text-sm animate-pulse">
            Press any key for next round
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full text-3xl leading-relaxed font-mono break-words">
        <div className="w-full min-h-[200px] whitespace-pre-wrap">
          {renderTypingText()}
        </div>
      </div>
      {renderProgressBar()}
      
      <input
        className="opacity-0 absolute pointer-events-none"
        ref={inputRef}
        type="text"
        value={input.currentText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCopy={handleCopy}
        onContextMenu={handleContextMenu}
        onBlur={() => inputRef.current?.focus()}
        disabled={round.isCompleted}
        autoComplete="off"
        spellCheck={false}
      />
      
      {round.isCompleted && renderResultsScreen()}
    </div>
  );
};

export { TypeArea };