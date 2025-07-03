interface Performance {
  typedCount: number;
  charCount: number;
  wordCount: number;
  totalTime: number;
  wpm: number;
  accuracy: number;
  targetWpm: number;
  wonAgainstTarget: boolean;
  finalUserPosition: number;
  finalTargetPosition: number;
}

export type { Performance };