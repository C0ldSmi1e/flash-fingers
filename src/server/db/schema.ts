import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// The ASCII check is the safety net for the game. A prompt holding a character
// that can't be produced on a US keyboard — em-dash, curly quote, ellipsis,
// emoji — makes a round impossible to finish, and a round has no escape but a
// page reload. Enforcing it here means no code path can store one.
//
// charCount and wordCount are generated, so they can't drift from the text.
// wordCount assumes single-space separation, which the ASCII check guarantees.
const prompts = sqliteTable(
  "prompts",
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
  (table) => [
    check("prompts_text_length", sql`length(${table.text}) BETWEEN 20 AND 150`),
    check("prompts_text_ascii", sql`${table.text} NOT GLOB '*[^ -~]*'`),
  ],
);

export { prompts };
