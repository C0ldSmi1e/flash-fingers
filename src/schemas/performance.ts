import { z } from "zod";

const PerformanceSchema = z.object({
  typedCount: z.number().int().nonnegative(),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive(),
  totalTime: z.number().nonnegative(),
  wpm: z.number().nonnegative(),
  accuracy: z.number().nonnegative(),
});

type Performance = z.infer<typeof PerformanceSchema>;

export { PerformanceSchema };
export type { Performance };
