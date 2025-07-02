interface Performance {
  typedCount: number;
  charCount: number;
  wordCount: number;
  totalTime: number;
  wpm: number;
  accuracy: number;
}

interface TypingSession {
  startTime: number | null;
  isCompleted: boolean;
  roundCount: number;
}

export type { Performance, TypingSession };