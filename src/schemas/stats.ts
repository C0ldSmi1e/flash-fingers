import { z } from "zod";

const UserStatsSchema = z.object({
  bestWpm: z.number().int().nonnegative(),
  rounds: z.number().int().nonnegative(),
});

const RankEntrySchema = UserStatsSchema.extend({
  name: z.string(),
});

type UserStats = z.infer<typeof UserStatsSchema>;
type RankEntry = z.infer<typeof RankEntrySchema>;

export { UserStatsSchema, RankEntrySchema };
export type { UserStats, RankEntry };
