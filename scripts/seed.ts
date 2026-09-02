// Local-only: loads the mock corpus. Run migrations first, then `bun scripts/seed.ts`.
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { content } from "@/src/server/db/schema";
import { content as mockContent } from "@/src/constant/content";

const db = drizzle(process.env.DATABASE_PATH ?? "data/flash-fingers.db");

db.insert(content)
  .values(mockContent.map((item) => ({ text: item.text })))
  .onConflictDoNothing()
  .run();

const [row] = db.select({ value: count() }).from(content).all();
console.log(`${row?.value ?? 0} rows (corpus has ${mockContent.length})`);
