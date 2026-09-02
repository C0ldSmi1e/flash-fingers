"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/src/utils/api";
import { RankEntry } from "@/src/schemas/stats";
import { useSession, signOut } from "@/src/utils/auth-client";

const HomePage = () => {
  const { data: session, isPending } = useSession();
  const [rank, setRank] = useState<RankEntry[]>([]);

  useEffect(() => {
    const loadRank = async () => {
      try {
        setRank(await api<RankEntry[]>("/api/rank", { cache: "no-store" }));
      } catch (error) {
        console.error(error);
      }
    };
    loadRank();
  }, []);

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

      {rank.length > 0 && (
        <table className="font-mono text-sm default-text">
          <thead>
            <tr className="opacity-50">
              <th className="px-3 py-1 text-left font-normal">#</th>
              <th className="px-3 py-1 text-left font-normal">player</th>
              <th className="px-3 py-1 text-right font-normal">best wpm</th>
              <th className="px-3 py-1 text-right font-normal">rounds</th>
            </tr>
          </thead>
          <tbody>
            {rank.map((entry, index) => (
              <tr key={entry.name}>
                <td className="px-3 py-1 opacity-50">{index + 1}</td>
                <td className="px-3 py-1">{entry.name}</td>
                <td className="px-3 py-1 text-right correct-text">
                  {entry.bestWpm}
                </td>
                <td className="px-3 py-1 text-right">{entry.rounds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
