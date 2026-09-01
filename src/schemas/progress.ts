import { z } from "zod";

const ProgressSchema = z.object({
  totalRounds: z.number().int().nonnegative(),
  totalTime: z.number().nonnegative(),
  averageWpm: z.number().nonnegative(),
  averageAccuracy: z.number().nonnegative(),
  bestWpm: z.number().nonnegative(),
  bestAccuracy: z.number().nonnegative(),
});

type Progress = z.infer<typeof ProgressSchema>;

export { ProgressSchema };
export type { Progress };
