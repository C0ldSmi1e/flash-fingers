import "server-only";
import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  DATABASE_PATH: z.string().min(1).default("data/flash-fingers.db"),
});

// Empty strings (e.g. from a copied .env.example) count as unset.
const parsed = envSchema.safeParse(
  Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== "")),
);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

const env = parsed.data;

export { env };
