import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "@/src/server/db";
import * as authSchema from "@/src/server/db/auth-schema";
import { env } from "@/src/server/env";
import { sendEmail } from "@/src/server/email";
import { AuthenticationError } from "@/src/server/errors";

const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Flash Fingers password",
        text: [
          `Hi ${user.name},`,
          "",
          "Someone asked to reset the password for this address. If it was you, open the link below within the hour:",
          url,
          "",
          "If it wasn't you, ignore this email and your password stays the same.",
        ].join("\n"),
      });
    },
  },
  // Sent on sign-up and again when an address is changed (user.email is the
  // new address then). Verification is never required to play.
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your Flash Fingers email",
        text: [
          `Hi ${user.name},`,
          "",
          `Open the link below within the hour to verify ${user.email}:`,
          url,
          "",
          "If you didn't expect this, you can ignore it.",
        ].join("\n"),
      });
    },
  },
  // The verification link goes to the new address via sendVerificationEmail
  // above; the email only changes once it's clicked.
  user: { changeEmail: { enabled: true } },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Google verifies the address it returns, so a Google sign-in may attach
  // to an existing password account with the same email instead of failing.
  account: { accountLinking: { trustedProviders: ["google"] } },
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
