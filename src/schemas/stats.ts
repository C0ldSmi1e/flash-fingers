import { z } from "zod";

const UserStatsSchema = z.object({
  bestWpm: z.number().int().nonnegative(),
  rounds: z.number().int().nonnegative(),
});

const RankEntrySchema = UserStatsSchema.extend({
  name: z.string(),
});

const rankQuerySchema = z.object({
  sort: z.enum(["wpm", "rounds"]).default("wpm"),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

type UserStats = z.infer<typeof UserStatsSchema>;
type RankEntry = z.infer<typeof RankEntrySchema>;
type RankSort = z.infer<typeof rankQuerySchema>["sort"];

export { UserStatsSchema, RankEntrySchema, rankQuerySchema };
export type { UserStats, RankEntry, RankSort };
