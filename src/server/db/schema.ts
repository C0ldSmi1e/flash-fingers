import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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

export { content };
