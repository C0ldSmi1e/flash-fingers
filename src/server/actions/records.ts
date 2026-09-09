import "server-only";
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/src/server/db";
import { content, records } from "@/src/server/db/schema";
import { record as recordLimits, stats } from "@/src/config/constants";
import type {
  CreateRecordInput,
  GameRecord,
  UserRecord,
} from "@/src/schemas/record";
import { BadRequestError, NotFoundError } from "@/src/server/errors";

// A round only completes fully correct, so correct chars = content length.
// Duration comes from the client's start/end pair (skew cancels within the
// pair); absolute positions are informational — createdAt is the anchor.
const createRecord = (
  userId: string,
  { contentId, typedCount, startedAt, endedAt }: CreateRecordInput,
): GameRecord => {
  if (endedAt <= startedAt) {
    throw new BadRequestError("endedAt must be after startedAt");
  }
  if (endedAt - Date.now() > 60_000) {
    throw new BadRequestError("endedAt is in the future");
  }

  const [row] = db
    .select({ charCount: content.charCount })
    .from(content)
    .where(eq(content.id, contentId))
    .all();

  if (!row) {
    throw new NotFoundError("Content not found");
  }

  const charCount = row.charCount ?? 0;
  if (typedCount < charCount) {
    throw new BadRequestError("typedCount is lower than the content length");
  }

  const totalTime = (endedAt - startedAt) / 1000;
  const wpm = Math.round(charCount / 5 / (totalTime / 60));
  const accuracy = Math.round((charCount / typedCount) * 100);

  if (wpm > recordLimits.maxWpm) {
    throw new BadRequestError("Implausible result");
  }

  const [inserted] = db
    .insert(records)
    .values({ userId, contentId, wpm, accuracy, typedCount, startedAt, endedAt })
    .returning({
      id: records.id,
      contentId: records.contentId,
      wpm: records.wpm,
      accuracy: records.accuracy,
      typedCount: records.typedCount,
      startedAt: records.startedAt,
      endedAt: records.endedAt,
    })
    .all();

  return inserted;
};

export { createRecord };

// vsAvg compares each round to the avg of the (up to) `window` rounds before it.
const getUserRecords = (
  userId: string,
  { limit, offset }: { limit: number; offset: number },
): { data: UserRecord[]; total: number } => {
  const avgBefore = sql<
    number | null
  >`round(avg(${records.wpm}) over (partition by ${records.userId} order by ${records.createdAt}, ${records.id} rows between ${sql.raw(String(stats.window))} preceding and 1 preceding))`;

  const rows = db
    .select({
      id: records.id,
      wpm: records.wpm,
      accuracy: records.accuracy,
      totalTime: sql<number>`(${records.endedAt} - ${records.startedAt}) / 1000.0`,
      createdAt: records.createdAt,
      avgBefore,
    })
    .from(records)
    .where(eq(records.userId, userId))
    .orderBy(desc(records.createdAt), desc(records.id))
    .limit(limit)
    .offset(offset)
    .all();

  const [totals] = db
    .select({ n: count() })
    .from(records)
    .where(eq(records.userId, userId))
    .all();

  return {
    data: rows.map(({ avgBefore, ...row }) => ({
      ...row,
      vsAvg: avgBefore === null ? null : row.wpm - avgBefore,
    })),
    total: totals?.n ?? 0,
  };
};

export { getUserRecords };
