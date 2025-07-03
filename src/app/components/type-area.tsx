"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/types/input";
import { Session } from "@/types/session";
import { Performance } from "@/types/performance";

interface TypeAreaProps {
  session: Session;
  input: Input;
  setInput: (input: Input) => void;
  onTypingStart: () => void;
  onCompletion: (performance: Performance) => void;
  onRestart: () => void;
}

const TypeArea = ({ session, input, setInput, onTypingStart, onCompletion, onRestart }: TypeAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (session.isCompleted) {
        e.preventDefault();
        e.stopPropagation();
        onRestart();
      }
    };

    if (session.isCompleted) {
      window.addEventListener("keydown", handleKeyPress, true);
      return () => window.removeEventListener("keydown", handleKeyPress, true);
    }
  }, [session.isCompleted, onRestart]);

  const calculatePerformance = (typedText: string): Performance => {
    const totalTime = (Date.now() - session.startTime.getTime()) / 1000;
    const correctChars = session.content.text.split("").filter(
      (char, index) => char === typedText[index]
    ).length;
    const accuracy = Math.round((correctChars / session.content.text.length) * 100);
    const wordsTyped = correctChars / 5; // Standard: 5 characters per word
    const wpm = totalTime > 0 ? Math.round((wordsTyped / totalTime) * 60) : 0;

    return {
      typedCount: typedText.length,
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
    }

    setInput({ ...input, currentText: newText });

    // Check for completion
    if (newText.length === session.content.text.length) {
      const isComplete = session.content.text.split("").every((char, index) => char === newText[index]);
      if (isComplete) {
        const finalPerformance = calculatePerformance(newText);
        onCompletion(finalPerformance);
      }
    }
  };

  const renderTypingText = () => {
    // Find first mismatch by comparing each character directly
    let firstMismatchIndex = -1;
    for (let i = 0; i < input.currentText.length; i++) {
      if (session.content.text[i] !== input.currentText[i]) {
        firstMismatchIndex = i;
        break;
      }
    }
    
    return session.content.text.split("").map((char, index) => {
      let className = "transition-colors duration-150";
      
      if (index < input.currentText.length) {
        if (firstMismatchIndex === -1 || index < firstMismatchIndex) {
          className += " text-green-600";
        } else {
          className += " text-red-500";
        }
      } else if (index === input.currentText.length && !session.isCompleted) {
        className += " text-gray-900 bg-blue-200 animate-pulse rounded px-0.5";
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
    if (!session.performance) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center animate-in fade-in duration-300">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Round Complete!</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">⏱️ Time:</span>
              <span className="font-semibold">{session.performance.totalTime.toFixed(1)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">🎯 Accuracy:</span>
              <span className="font-semibold">{session.performance.accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">⚡ Speed:</span>
              <span className="font-semibold">{session.performance.wpm} WPM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">📊 Characters:</span>
              <span className="font-semibold">{session.performance.charCount}/{session.content.text.length}</span>
            </div>
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
        disabled={session.isCompleted}
        autoComplete="off"
        spellCheck={false}
      />
      
      {session.isCompleted && renderResultsScreen()}
    </div>
  );
};

export { TypeArea };