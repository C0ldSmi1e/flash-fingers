import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "@/src/server/db";
import * as authSchema from "@/src/server/db/auth-schema";
import { env } from "@/src/server/env";
import { AuthenticationError } from "@/src/server/errors";

const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
  emailAndPassword: { enabled: true },
});

type Session = typeof auth.$Infer.Session;

// Throws AuthenticationError (→ 401) when there is no valid session.
const requireAuth = async (): Promise<Session> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new AuthenticationError("Sign in required");
  }
  return session;
};

export { auth, requireAuth };
export type { Session };
