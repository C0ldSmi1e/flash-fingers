import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { db } from "@/src/server/db";
import * as authSchema from "@/src/server/db/auth-schema";
import { env } from "@/src/server/env";
import { sendEmail } from "@/src/server/email";
import { AuthenticationError } from "@/src/server/errors";

const CODE_TTL_MINUTES = 10;

// No passwords: an email code or Google signs you in, creating the account
// on first use.
const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
  plugins: [
    emailOTP({
      expiresIn: CODE_TTL_MINUTES * 60,
      sendVerificationOTP: async ({ email, otp, type }) => {
        // Only sign-in codes are used; the plugin's other flows stay silent.
        if (type !== "sign-in") {
          return;
        }
        await sendEmail({
          to: email,
          subject: `${otp} is your Flash Fingers code`,
          text: [
            `Your Flash Fingers sign-in code is ${otp}`,
            "",
            `Type it on the sign-in page within ${CODE_TTL_MINUTES} minutes.`,
            "",
            "If you didn't ask for it, you can ignore this email.",
          ].join("\n"),
        });
      },
    }),
  ],
  // Used by change email: the link goes to the new address, and the email
  // only changes once it's clicked.
  emailVerification: {
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
  user: { changeEmail: { enabled: true } },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Google verifies the address it returns, so it may attach to an existing
  // account with the same email. Email codes always work, so unlinking Google
  // can't lock anyone out.
  account: {
    accountLinking: { trustedProviders: ["google"], allowUnlinkingAll: true },
  },
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
