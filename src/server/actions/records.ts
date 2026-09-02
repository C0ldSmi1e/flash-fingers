import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/src/server/db";
import { content, records } from "@/src/server/db/schema";
import { record as recordLimits } from "@/src/config/constants";
import type { CreateRecordInput, GameRecord } from "@/src/schemas/record";
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
