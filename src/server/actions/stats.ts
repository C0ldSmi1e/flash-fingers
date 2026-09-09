import "server-only";
import { and, count, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { db } from "@/src/server/db";
import { records } from "@/src/server/db/schema";
import { user } from "@/src/server/db/auth-schema";
import { stats } from "@/src/config/constants";
import type { RankEntry, RankSort, UserStats } from "@/src/schemas/stats";

// Per-user rolling avg (last `window` rounds) and totals, as CTEs.
const rankTables = () => {
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

  return { ranked, recent, totals };
};

const getUserStats = (userId: string): UserStats => {
  const { ranked, recent, totals } = rankTables();
  const qualified = gte(totals.rounds, stats.rankMinRounds);

  const [me] = db
    .with(ranked, recent, totals)
    .select({
      avgWpm: recent.avgWpm,
      bestWpm: totals.bestWpm,
      rounds: totals.rounds,
    })
    .from(recent)
    .innerJoin(totals, eq(totals.userId, recent.userId))
    .where(eq(recent.userId, userId))
    .all();

  const [players] = db
    .with(ranked, recent, totals)
    .select({ n: count() })
    .from(recent)
    .innerJoin(totals, eq(totals.userId, recent.userId))
    .where(qualified)
    .all();

  let rank: number | null = null;
  if (me && me.rounds >= stats.rankMinRounds) {
    const [ahead] = db
      .with(ranked, recent, totals)
      .select({ n: count() })
      .from(recent)
      .innerJoin(totals, eq(totals.userId, recent.userId))
      .where(
        and(
          qualified,
          or(
            sql`${recent.avgWpm} > ${me.avgWpm}`,
            and(
              sql`${recent.avgWpm} = ${me.avgWpm}`,
              sql`${totals.rounds} > ${me.rounds}`,
            ),
          ),
        ),
      )
      .all();
    rank = (ahead?.n ?? 0) + 1;
  }

  return {
    avgWpm: me?.avgWpm ?? 0,
    bestWpm: me?.bestWpm ?? 0,
    rounds: me?.rounds ?? 0,
    rank,
    rankedPlayers: players?.n ?? 0,
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
  const { ranked, recent, totals } = rankTables();

  return db
    .with(ranked, recent, totals)
    .select({
      userId: recent.userId,
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
