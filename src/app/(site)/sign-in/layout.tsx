import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in or create a free account to save your rounds and join the leaderboard.",
  alternates: { canonical: "/sign-in" },
};

const SignInLayout = ({ children }: { children: React.ReactNode }) => children;

export default SignInLayout;
