"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/src/utils/api";
import { stats } from "@/src/config/constants";
import { RankEntry, UserStats } from "@/src/schemas/stats";
import { useSession, signOut } from "@/src/utils/auth-client";

const HomePage = () => {
  const { data: session, isPending } = useSession();
  const [rank, setRank] = useState<RankEntry[]>([]);
  const [me, setMe] = useState<UserStats | null>(null);

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

  useEffect(() => {
    if (!session) {
      return;
    }
    const loadMe = async () => {
      try {
        setMe(await api<UserStats>("/api/me", { cache: "no-store" }));
      } catch (error) {
        console.error(error);
      }
    };
    loadMe();
  }, [session]);

  const userId = session?.user.id;
  const myStats = session ? me : null;
  const inTable = rank.some((entry) => entry.userId === userId);
  const pinned = myStats?.rank && !inTable;

  const row = (entry: RankEntry, position: number) => {
    const isYou = entry.userId === userId;
    return (
      <tr key={entry.userId}>
        <td className="px-3 py-1 opacity-50">{position}</td>
        <td className={`px-3 py-1 ${isYou ? "correct-text" : ""}`}>{entry.name}</td>
        <td className="px-3 py-1 text-right correct-text">{entry.avgWpm}</td>
        <td className="px-3 py-1 text-right">{entry.bestWpm}</td>
        <td className="px-3 py-1 text-right">{entry.rounds}</td>
      </tr>
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6 relative">
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
        <table className="font-mono text-sm default-text tabular-nums">
          <thead>
            <tr className="opacity-50">
              <th className="px-3 py-1 text-left font-normal">#</th>
              <th className="px-3 py-1 text-left font-normal">player</th>
              <th className="px-3 py-1 text-right font-normal">avg wpm</th>
              <th className="px-3 py-1 text-right font-normal">best</th>
              <th className="px-3 py-1 text-right font-normal">rounds</th>
            </tr>
          </thead>
          <tbody>
            {rank.map((entry, index) => row(entry, index + 1))}
            {pinned && session && myStats && (
              <>
                <tr>
                  <td
                    colSpan={5}
                    className="text-center opacity-30 tracking-[.25em] py-0.5"
                  >
                    ···
                  </td>
                </tr>
                {row(
                  {
                    userId: session.user.id,
                    name: session.user.name,
                    avgWpm: myStats.avgWpm,
                    bestWpm: myStats.bestWpm,
                    rounds: myStats.rounds,
                  },
                  myStats.rank!,
                )}
              </>
            )}
          </tbody>
        </table>
      )}

      {myStats && (
        <p className="font-mono text-xs default-text opacity-50 -mt-3">
          {myStats.rank !== null
            ? `#${myStats.rank} of ${myStats.rankedPlayers}`
            : `play ${stats.rankMinRounds - myStats.rounds} more rounds to be ranked`}
        </p>
      )}

      <p className="absolute bottom-5 font-mono text-xs default-text opacity-30">
        <Link href="/terms">terms</Link> · <Link href="/privacy">privacy</Link>
      </p>

      <div className="h-6 text-sm font-mono">
        {!isPending &&
          (session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/me"
                className="correct-text hover:opacity-70 transition-opacity"
              >
                {session.user.name}
              </Link>
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
