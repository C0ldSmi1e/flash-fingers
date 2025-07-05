"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/types/input";

interface TypingInputProps {
  input: Input;
  setInput: (input: Input) => void;
  isCompleted: boolean;
  onTypingStart: () => void;
  onInputChange: (newText: string, lengthDiff: number) => void;
}

const TypingInput = ({ input, setInput, isCompleted, onTypingStart, onInputChange }: TypingInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleInputChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Update typedCount - increment only when adding characters (not when deleting)
    const newTypedCount = lengthDiff === 1 ? input.typedCount + 1 : input.typedCount;
    
    setInput({ 
      ...input, 
      currentText: newText,
      typedCount: newTypedCount
    });

    // Notify parent of the change
    onInputChange(newText, lengthDiff);
  };

  return (
    <input
      className="opacity-0 absolute pointer-events-none"
      ref={inputRef}
      type="text"
      value={input.currentText}
      onChange={handleInputChangeInternal}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onContextMenu={handleContextMenu}
      onBlur={() => inputRef.current?.focus()}
      disabled={isCompleted}
      autoComplete="off"
      spellCheck={false}
    />
  );
};

export { TypingInput };