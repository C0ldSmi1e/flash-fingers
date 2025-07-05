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
              className += " correct-text";
            } else {
              className += " wrong-text";
              // Special handling for unmatched spaces - add red background
              if (char === " ") {
                className += " wrong-space";
              }
            }
          } else if (index === currentText.length && !isCompleted) {
            className += " cursor-text";
          } else {
            className += " default-text";
          }
          
          // Best pace underline - progress bar color for characters up to pace position
          if (bestPaceIndex >= 0 && index < bestPaceIndex) {
            className += " progress-underline";
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