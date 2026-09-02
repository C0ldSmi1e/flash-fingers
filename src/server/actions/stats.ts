import "server-only";
import { count, desc, eq, max, sql } from "drizzle-orm";
import { db } from "@/src/server/db";
import { records } from "@/src/server/db/schema";
import { user } from "@/src/server/db/auth-schema";
import type { RankEntry, RankSort, UserStats } from "@/src/schemas/stats";

const getUserStats = (userId: string): UserStats => {
  const [row] = db
    .select({ bestWpm: max(records.wpm), rounds: count() })
    .from(records)
    .where(eq(records.userId, userId))
    .all();

  return { bestWpm: row?.bestWpm ?? 0, rounds: row?.rounds ?? 0 };
};

const getRank = ({
  sort,
  limit,
  offset,
}: {
  sort: RankSort;
  limit: number;
  offset: number;
}): RankEntry[] => {
  const bestWpm = sql<number>`max(${records.wpm})`;
  const rounds = count();

  return db
    .select({ name: user.name, bestWpm, rounds })
    .from(records)
    .innerJoin(user, eq(user.id, records.userId))
    .groupBy(records.userId)
    .orderBy(
      ...(sort === "rounds"
        ? [desc(rounds), desc(bestWpm)]
        : [desc(bestWpm), desc(rounds)]),
    )
    .limit(limit)
    .offset(offset)
    .all();
};

export { getUserStats, getRank };
