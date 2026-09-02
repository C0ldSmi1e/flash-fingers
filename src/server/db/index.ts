import "server-only";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { env } from "@/src/server/env";

const createDb = () => {
  mkdirSync(dirname(env.DATABASE_PATH), { recursive: true });

  const db = drizzle(env.DATABASE_PATH);

  db.run(sql`PRAGMA journal_mode = WAL`);
  db.run(sql`PRAGMA foreign_keys = ON`);
  db.run(sql`PRAGMA busy_timeout = 5000`);

  return db;
};

// Cached on globalThis so dev HMR reuses one connection.
const globalForDb = globalThis as typeof globalThis & {
  flashFingersDb?: ReturnType<typeof createDb>;
};

const db = (globalForDb.flashFingersDb ??= createDb());

export { db };
