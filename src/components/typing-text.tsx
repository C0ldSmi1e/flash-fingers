"use client";

interface TypingTextProps {
  content: string;
  currentText: string;
  bestPaceIndex: number;
  isCompleted: boolean;
}

interface WordData {
  text: string;
  startIndex: number;
  endIndex: number;
}

const TypingText = ({ content, currentText, bestPaceIndex, isCompleted }: TypingTextProps) => {
  // Parse content into words while preserving spaces
  const parseIntoWords = (text: string): WordData[] => {
    const words: WordData[] = [];
    let currentIndex = 0;
    
    // Split by spaces but keep track of positions
    const parts = text.split(/(\s+)/);
    
    for (const part of parts) {
      if (part.length > 0) {
        words.push({
          text: part,
          startIndex: currentIndex,
          endIndex: currentIndex + part.length - 1
        });
        currentIndex += part.length;
      }
    }
    
    return words;
  };

  const words = parseIntoWords(content);
  
  // Find first mismatch by comparing each character directly
  let firstMismatchIndex = -1;
  for (let i = 0; i < currentText.length; i++) {
    if (content[i] !== currentText[i]) {
      firstMismatchIndex = i;
      break;
    }
  }

  const renderWord = (word: WordData, wordIndex: number) => {
    return word.text.split("").map((char, charIndex) => {
      const globalIndex = word.startIndex + charIndex;
      let className = "transition-colors";
      
      // User typing status (green for correct, red for incorrect)
      if (globalIndex < currentText.length) {
        if (firstMismatchIndex === -1 || globalIndex < firstMismatchIndex) {
          className += " correct-text";
        } else {
          className += " wrong-text";
          // Special handling for unmatched spaces - add red background
          if (char === " ") {
            className += " wrong-space";
          }
        }
      } else if (globalIndex === currentText.length && !isCompleted) {
        className += " cursor-text";
      } else {
        className += " default-text";
      }
      
      // Best pace underline - progress bar color for characters up to pace position
      if (bestPaceIndex >= 0 && globalIndex < bestPaceIndex) {
        className += " progress-underline";
      }

      return (
        <span key={`${wordIndex}-${charIndex}`} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full text-3xl leading-relaxed font-sans">
      <div className="w-full min-h-[200px] break-words whitespace-pre-wrap font-mono">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline">
            {renderWord(word, wordIndex)}
          </span>
        ))}
      </div>
    </div>
  );
};

export { TypingText };