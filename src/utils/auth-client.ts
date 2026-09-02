import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

const { useSession, signIn, signUp, signOut } = authClient;

export { authClient, useSession, signIn, signUp, signOut };
