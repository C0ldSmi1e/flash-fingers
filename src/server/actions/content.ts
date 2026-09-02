import "server-only";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/src/server/db";
import { content } from "@/src/server/db/schema";
import { contentText } from "@/src/config/constants";
import { ContentSchema, type Content } from "@/src/schemas/content";
import {
  BadRequestError,
  NotFoundError,
  isUniqueViolation,
} from "@/src/server/errors";

// Length is enforced here, not in the DB — see src/config/constants.ts.
const ContentTextSchema = z
  .string()
  .trim()
  .min(contentText.minLength)
  .max(contentText.maxLength)
  .regex(/^[ -~]+$/, "printable ASCII only");

const getRandomContent = ({ limit }: { limit: number }): Content[] => {
  const rows = db
    .select({
      id: content.id,
      text: content.text,
      charCount: content.charCount,
      wordCount: content.wordCount,
    })
    .from(content)
    .orderBy(sql`RANDOM()`)
    .limit(limit)
    .all();

  if (rows.length === 0) {
    throw new NotFoundError("No content available");
  }

  return rows.map((row) => ContentSchema.parse(row));
};

// Validates each text, inserts the valid ones, returns what happened to each.
const createContent = (texts: string[]) => {
  const valid: string[] = [];
  const rejected: { text: string; reason: string }[] = [];

  for (const raw of texts) {
    const result = ContentTextSchema.safeParse(raw);
    if (result.success) {
      valid.push(result.data);
    } else {
      rejected.push({ text: raw, reason: result.error.issues[0].message });
    }
  }

  if (valid.length === 0) {
    throw new BadRequestError("No valid texts to insert");
  }

  let inserted = 0;
  for (const text of valid) {
    try {
      db.insert(content).values({ text }).run();
      inserted++;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
      rejected.push({ text, reason: "duplicate" });
    }
  }

  return { inserted, rejected };
};

export { getRandomContent, createContent };
