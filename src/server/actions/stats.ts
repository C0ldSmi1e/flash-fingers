import "server-only";
import { avg, count, desc, eq, gte, lte, max, sql } from "drizzle-orm";
import { db } from "@/src/server/db";
import { records } from "@/src/server/db/schema";
import { user } from "@/src/server/db/auth-schema";
import { stats } from "@/src/config/constants";
import type { RankEntry, RankSort, UserStats } from "@/src/schemas/stats";

const getUserStats = (userId: string): UserStats => {
  const recent = db
    .select({ wpm: records.wpm })
    .from(records)
    .where(eq(records.userId, userId))
    .orderBy(desc(records.createdAt), desc(records.id))
    .limit(stats.window)
    .as("recent");

  const [avgRow] = db
    .select({ avgWpm: avg(recent.wpm) })
    .from(recent)
    .all();
  const [totals] = db
    .select({ bestWpm: max(records.wpm), rounds: count() })
    .from(records)
    .where(eq(records.userId, userId))
    .all();

  return {
    avgWpm: Math.round(Number(avgRow?.avgWpm ?? 0)),
    bestWpm: totals?.bestWpm ?? 0,
    rounds: totals?.rounds ?? 0,
  };
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
  // Each user's rounds numbered newest-first; the window is rn <= stats.window.
  const ranked = db.$with("ranked").as(
    db
      .select({
        userId: records.userId,
        wpm: records.wpm,
        rn: sql<number>`row_number() over (partition by ${records.userId} order by ${records.createdAt} desc, ${records.id} desc)`.as(
          "rn",
        ),
      })
      .from(records),
  );

  const recent = db.$with("recent").as(
    db
      .select({
        userId: ranked.userId,
        avgWpm: sql<number>`round(avg(${ranked.wpm}))`.as("avg_wpm"),
      })
      .from(ranked)
      .where(lte(ranked.rn, stats.window))
      .groupBy(ranked.userId),
  );

  const totals = db.$with("totals").as(
    db
      .select({
        userId: records.userId,
        bestWpm: sql<number>`max(${records.wpm})`.as("best_wpm"),
        rounds: count().as("rounds"),
      })
      .from(records)
      .groupBy(records.userId),
  );

  return db
    .with(ranked, recent, totals)
    .select({
      name: user.name,
      avgWpm: recent.avgWpm,
      bestWpm: totals.bestWpm,
      rounds: totals.rounds,
    })
    .from(recent)
    .innerJoin(totals, eq(totals.userId, recent.userId))
    .innerJoin(user, eq(user.id, recent.userId))
    .where(gte(totals.rounds, stats.rankMinRounds))
    .orderBy(
      ...(sort === "rounds"
        ? [desc(totals.rounds), desc(recent.avgWpm)]
        : [desc(recent.avgWpm), desc(totals.rounds)]),
    )
    .limit(limit)
    .offset(offset)
    .all();
};

export { getUserStats, getRank };
