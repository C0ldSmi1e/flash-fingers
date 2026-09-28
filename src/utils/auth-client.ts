import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const authClient = createAuthClient({ plugins: [emailOTPClient()] });

const { useSession, signIn, signOut } = authClient;

export { authClient, useSession, signIn, signOut };
