import { z } from "zod";
import { ContentSchema } from "@/src/schemas/content";
import { PerformanceSchema } from "@/src/schemas/performance";

const RoundSchema = z.object({
  isCompleted: z.boolean(),
  performance: PerformanceSchema.nullable(),
  content: ContentSchema,
});

type Round = z.infer<typeof RoundSchema>;

export { RoundSchema };
export type { Round };
