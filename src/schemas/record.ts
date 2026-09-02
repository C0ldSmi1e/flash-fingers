import { z } from "zod";

// Client submits raw facts only — wpm/accuracy/duration are computed
// server-side. startedAt/endedAt are epoch ms from the client clock.
const createRecordSchema = z.object({
  contentId: z.number().int().positive(),
  typedCount: z.number().int().positive(),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive(),
});

const RecordSchema = z.object({
  id: z.number().int().positive(),
  contentId: z.number().int().positive(),
  wpm: z.number().int().nonnegative(),
  accuracy: z.number().int().min(0).max(100),
  typedCount: z.number().int().positive(),
  startedAt: z.number().int().positive(),
  endedAt: z.number().int().positive(),
});

type CreateRecordInput = z.infer<typeof createRecordSchema>;
type GameRecord = z.infer<typeof RecordSchema>;

export { createRecordSchema, RecordSchema };
export type { CreateRecordInput, GameRecord };
