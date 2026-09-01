import { z } from "zod";

const PerformanceSchema = z.object({
  typedCount: z.number().int().nonnegative(),
  charCount: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  totalTime: z.number().nonnegative(),
  wpm: z.number().nonnegative(),
  accuracy: z.number().nonnegative(),
});

type Performance = z.infer<typeof PerformanceSchema>;

export { PerformanceSchema };
export type { Performance };
