import { z } from "zod";
import { RoundSchema } from "@/src/schemas/round";
import { ProgressSchema } from "@/src/schemas/progress";

const GameSchema = z.object({
  id: z.uuid(),
  startedAt: z.date(),
  rounds: z.array(RoundSchema),
  progress: ProgressSchema,
});

type Game = z.infer<typeof GameSchema>;

export { GameSchema };
export type { Game };
