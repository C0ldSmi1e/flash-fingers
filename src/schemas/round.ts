import { z } from "zod";
import { ContentSchema } from "@/src/schemas/content";
import { PerformanceSchema } from "@/src/schemas/performance";

// Dates are held as Date instances because a round only ever lives in memory.
// If a round is later persisted or sent over JSON, the boundary will need a
// coercing variant (z.coerce.date()) rather than this one.
const RoundSchema = z.object({
  id: z.uuid(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  isCompleted: z.boolean(),
  performance: PerformanceSchema.nullable(),
  content: ContentSchema,
});

type Round = z.infer<typeof RoundSchema>;

export { RoundSchema };
export type { Round };
