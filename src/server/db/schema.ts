import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "@/src/server/db/auth-schema";

// Non-ASCII text (em-dash, curly quotes) can't be typed, making a round
// impossible to finish — the ASCII check blocks it at the DB level.
const content = sqliteTable(
  "content",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    text: text("text").notNull().unique(),
    charCount: integer("char_count").generatedAlwaysAs(sql`length(text)`, {
      mode: "stored",
    }),
    wordCount: integer("word_count").generatedAlwaysAs(
      sql`length(trim(text)) - length(replace(trim(text), ' ', '')) + 1`,
      { mode: "stored" },
    ),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [check("content_text_ascii", sql`${table.text} NOT GLOB '*[^ -~]*'`)],
);

// One completed round per row. wpm/accuracy are computed server-side at
// insert — never trusted from the client.
const records = sqliteTable(
  "records",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contentId: integer("content_id")
      .notNull()
      .references(() => content.id),
    wpm: integer("wpm").notNull(),
    accuracy: integer("accuracy").notNull(),
    typedCount: integer("typed_count").notNull(),
    startedAt: integer("started_at").notNull(),
    endedAt: integer("ended_at").notNull(),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index("idx_records_rank").on(table.userId, table.wpm)],
);

export { content, records };
