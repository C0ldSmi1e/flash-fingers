import "server-only";
import { count, eq, max } from "drizzle-orm";
import { db } from "@/src/server/db";
import { records } from "@/src/server/db/schema";
import type { UserStats } from "@/src/schemas/stats";

const getUserStats = (userId: string): UserStats => {
  const [row] = db
    .select({ bestWpm: max(records.wpm), rounds: count() })
    .from(records)
    .where(eq(records.userId, userId))
    .all();

  return { bestWpm: row?.bestWpm ?? 0, rounds: row?.rounds ?? 0 };
};

export { getUserStats };
