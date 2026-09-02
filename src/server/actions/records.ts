import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/src/server/db";
import { content, records } from "@/src/server/db/schema";
import { record as recordLimits } from "@/src/config/constants";
import type { CreateRecordInput, GameRecord } from "@/src/schemas/record";
import { BadRequestError, NotFoundError } from "@/src/server/errors";

// A round only completes fully correct, so correct chars = content length.
const createRecord = (
  userId: string,
  { contentId, typedCount, totalTime }: CreateRecordInput,
): GameRecord => {
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

  const wpm = Math.round(charCount / 5 / (totalTime / 60));
  const accuracy = Math.round((charCount / typedCount) * 100);

  if (wpm > recordLimits.maxWpm) {
    throw new BadRequestError("Implausible result");
  }

  const [inserted] = db
    .insert(records)
    .values({ userId, contentId, wpm, accuracy, typedCount, totalTime })
    .returning({
      id: records.id,
      contentId: records.contentId,
      wpm: records.wpm,
      accuracy: records.accuracy,
      typedCount: records.typedCount,
      totalTime: records.totalTime,
    })
    .all();

  return inserted;
};

export { createRecord };
