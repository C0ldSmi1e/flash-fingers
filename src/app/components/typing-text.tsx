"use client";

interface TypingTextProps {
  content: string;
  currentText: string;
  bestPaceIndex: number;
  isCompleted: boolean;
}

const TypingText = ({ content, currentText, bestPaceIndex, isCompleted }: TypingTextProps) => {
  // Find first mismatch by comparing each character directly
  let firstMismatchIndex = -1;
  for (let i = 0; i < currentText.length; i++) {
    if (content[i] !== currentText[i]) {
      firstMismatchIndex = i;
      break;
    }
  }

  return (
    <div className="w-full text-3xl leading-relaxed font-mono break-words">
      <div className="w-full min-h-[200px] whitespace-pre-wrap">
        {content.split("").map((char, index) => {
          let className = "transition-colors duration-150";
          
          // User typing status (green for correct, red for incorrect)
          if (index < currentText.length) {
            if (firstMismatchIndex === -1 || index < firstMismatchIndex) {
              className += " text-green-600";
            } else {
              className += " text-red-500";
              // Special handling for unmatched spaces - add red background
              if (char === " ") {
                className += " bg-red-200";
              }
            }
          } else if (index === currentText.length && !isCompleted) {
            className += " text-gray-900 bg-blue-200 animate-pulse";
          } else {
            className += " text-gray-400";
          }
          
          // Best pace underline - red bottom border for characters up to pace position
          if (bestPaceIndex >= 0 && index < bestPaceIndex) {
            className += " border-b-2 border-red-500";
          }

          return (
            <span key={index} className={className}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export { TypingText };