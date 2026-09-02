"use client";

import Link from "next/link";
import { useSession, signOut } from "@/src/utils/auth-client";

const HomePage = () => {
  const { data: session, isPending } = useSession();

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-5xl font-mono font-bold default-text">Flash Fingers</h1>
      <p className="default-text opacity-60 text-lg">
        A minimalist typing game. How fast are your fingers?
      </p>
      <Link
        href="/play"
        className="mt-4 px-8 py-3 rounded-lg font-mono text-lg correct-text border border-current hover:opacity-70 transition-opacity"
      >
        Play
      </Link>

      <div className="h-6 text-sm font-mono">
        {!isPending &&
          (session ? (
            <div className="flex items-center gap-3">
              <span className="default-text">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="default-text opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="default-text opacity-60 hover:opacity-100 transition-opacity"
            >
              Sign in
            </Link>
          ))}
      </div>
    </div>
  );
};

export default HomePage;
