"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/src/utils/api";
import { pagination, stats } from "@/src/config/constants";
import { UserStats } from "@/src/schemas/stats";
import { UserRecord } from "@/src/schemas/record";
import { StandardResponse } from "@/src/schemas/standard-response";
import { TrendLine } from "@/src/components/trend-line";
import { authClient, useSession, signOut } from "@/src/utils/auth-client";

type AccountMode = null | "rename" | "password" | "email";

// Shape of one row from authClient.listAccounts(); id is what unlink takes.
type LinkedAccount = { id: string; providerId: string };

const formatWhen = (unixSeconds: number) => {
  const date = new Date(unixSeconds * 1000);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `today ${date.toTimeString().slice(0, 5)}`;
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const PAGE_SIZE = pagination.defaultLimit * 2;

const MePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [me, setMe] = useState<UserStats | null>(null);
  const [rounds, setRounds] = useState<UserRecord[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [mode, setMode] = useState<AccountMode>(null);
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRounds = async (offset: number) => {
    // Raw fetch: the api helper drops the pagination envelope.
    const response = await fetch(
      `/api/me/records?offset=${offset}&limit=${PAGE_SIZE}`,
      {
        cache: "no-store",
      },
    );
    const body = (await response.json()) as StandardResponse<UserRecord[]>;
    if (body.error !== null || !body.data) {
      throw new Error(body.error ?? "Failed to load rounds");
    }
    setRounds((prev) => (offset === 0 ? body.data! : [...prev, ...body.data!]));
    setHasMore(body.pagination?.hasMore ?? false);
  };

  const loadAccounts = async () => {
    const result = await authClient.listAccounts();
    if (!result.error) {
      setAccounts(result.data);
    }
  };

  const load = async () => {
    try {
      setMe(await api<UserStats>("/api/me", { cache: "no-store" }));
      await Promise.all([loadRounds(0), loadAccounts()]);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify-email and link-social callbacks land back here with ?error=CODE.
  useEffect(() => {
    const code = searchParams.get("error");
    if (code) {
      setError(`Something went wrong: ${code.replaceAll("_", " ").toLowerCase()}`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
      return;
    }
    if (session) {
      setName(session.user.name);
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isPending]);

  const openMode = (next: AccountMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleRename = async () => {
    const result = await authClient.updateUser({ name: name.trim() });
    if (result.error) {
      setError(result.error.message ?? "Could not rename");
      return;
    }
    setMode(null);
    setNotice("Renamed");
  };

  const handleChangePassword = async () => {
    const result = await authClient.changePassword({ currentPassword, newPassword });
    if (result.error) {
      setError(result.error.message ?? "Could not change password");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMode(null);
    setNotice("Password changed");
  };

  const handleChangeEmail = async () => {
    const result = await authClient.changeEmail({
      newEmail: newEmail.trim(),
      callbackURL: "/me",
    });
    if (result.error) {
      setError(result.error.message ?? "Could not change email");
      return;
    }
    setMode(null);
    setNotice(`Check ${newEmail.trim()} for a confirmation link`);
  };

  const googleAccount = accounts.find((account) => account.providerId === "google");

  const handleLinkGoogle = async () => {
    setError(null);
    setNotice(null);
    // Redirects to Google and returns to /me once linked.
    const result = await authClient.linkSocial({
      provider: "google",
      callbackURL: "/me",
    });
    if (result.error) {
      setError(result.error.message ?? "Could not link Google");
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!googleAccount) {
      return;
    }
    setError(null);
    setNotice(null);
    const result = await authClient.unlinkAccount({ accountId: googleAccount.id });
    if (result.error) {
      // better-auth refuses sensitive changes on an old session.
      setError(
        result.error.code === "SESSION_EXPIRED" ||
          /not fresh/i.test(result.error.message ?? "")
          ? "Sign in again to unlink Google"
          : (result.error.message ?? "Could not unlink Google"),
      );
      return;
    }
    await loadAccounts();
    setNotice("Google unlinked");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isPending || !session || !me) {
    return null;
  }

  const trend = rounds
    .slice(0, stats.trendRounds)
    .map((round) => round.wpm)
    .reverse();

  const fieldClass =
    "font-mono text-sm default-text bg-transparent border-0 border-b border-current opacity-80 focus:opacity-100 focus:border-[var(--color-correct-text)] outline-none px-0.5 py-1 w-44";
  const linkClass = "cursor-pointer hover:opacity-100 transition-opacity";

  return (
    <div className="w-full flex flex-col items-center min-h-screen gap-7 py-16 relative font-mono">
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm default-text opacity-40 hover:opacity-100 transition-opacity"
      >
        &larr; home
      </Link>

      <h1 className="text-2xl font-medium default-text">{session.user.name}</h1>

      <div className="flex items-baseline gap-3.5 text-lg default-text tabular-nums">
        <span className="correct-text text-2xl font-semibold">
          {me.avgWpm}
          <small className="text-xs ml-1 opacity-60">avg wpm</small>
        </span>
        <span className="opacity-30">·</span>
        <span>
          {me.bestWpm}
          <small className="text-xs ml-1 opacity-60">best</small>
        </span>
        <span className="opacity-30">·</span>
        <span>
          {me.rounds}
          <small className="text-xs ml-1 opacity-60">rounds</small>
        </span>
        {me.rank !== null && (
          <>
            <span className="opacity-30">·</span>
            <span>
              #{me.rank}
              <small className="text-xs ml-1 opacity-60">
                of {me.rankedPlayers}
              </small>
            </span>
          </>
        )}
      </div>

      {trend.length >= 2 && (
        <div className="w-full max-w-[420px] px-6 flex flex-col items-center gap-1.5">
          <TrendLine values={trend} avg={me.avgWpm} />
          <span className="text-xs default-text opacity-45">
            last {trend.length} rounds · dashed line is your average
          </span>
        </div>
      )}

      {rounds.length > 0 && (
        <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-5 gap-y-2 text-sm default-text tabular-nums">
          {rounds.map((round) => (
            <div key={round.id} className="contents">
              <span className="text-right">{round.wpm}</span>
              <span
                className={`text-xs text-right ${
                  round.vsAvg === null
                    ? "opacity-0"
                    : round.vsAvg >= 0
                      ? "correct-text"
                      : "wrong-text opacity-75"
                }`}
              >
                {round.vsAvg === null
                  ? "–"
                  : `${round.vsAvg >= 0 ? "+" : ""}${round.vsAvg}`}
              </span>
              <span className="text-right opacity-55">
                {round.totalTime.toFixed(1)}s
              </span>
              <span className="text-xs opacity-35">
                {formatWhen(round.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={() => loadRounds(rounds.length)}
          className={`text-xs default-text opacity-40 ${linkClass}`}
        >
          older rounds &darr;
        </button>
      )}

      {rounds.length === 0 && (
        <p className="text-sm default-text opacity-50">No rounds yet. Play one.</p>
      )}

      <div className="flex flex-col items-center gap-3.5 text-sm default-text mt-4">
        <div className="flex gap-4 opacity-60">
          <button onClick={() => openMode("rename")} className={linkClass}>
            rename
          </button>
          <button onClick={() => openMode("email")} className={linkClass}>
            change email
          </button>
          <button onClick={() => openMode("password")} className={linkClass}>
            change password
          </button>
          <button
            onClick={googleAccount ? handleUnlinkGoogle : handleLinkGoogle}
            className={linkClass}
          >
            {googleAccount ? "unlink google" : "link google"}
          </button>
          <button onClick={handleSignOut} className={linkClass}>
            sign out
          </button>
        </div>

        {mode === "email" && (
          <div className="flex items-baseline gap-3">
            <input
              className={fieldClass}
              type="email"
              placeholder="new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              aria-label="new email"
              autoFocus
            />
            <button
              onClick={handleChangeEmail}
              className={`correct-text ${linkClass}`}
            >
              send link
            </button>
            <button
              onClick={() => setMode(null)}
              className={`opacity-45 ${linkClass}`}
            >
              cancel
            </button>
          </div>
        )}

        {mode === "rename" && (
          <div className="flex items-baseline gap-3">
            <input
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="new name"
              autoFocus
            />
            <button onClick={handleRename} className={`correct-text ${linkClass}`}>
              save
            </button>
            <button
              onClick={() => setMode(null)}
              className={`opacity-45 ${linkClass}`}
            >
              cancel
            </button>
          </div>
        )}

        {mode === "password" && (
          <div className="flex flex-wrap items-baseline justify-center gap-3">
            <input
              className={fieldClass}
              type="password"
              placeholder="current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoFocus
            />
            <input
              className={fieldClass}
              type="password"
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
            />
            <button
              onClick={handleChangePassword}
              className={`correct-text ${linkClass}`}
            >
              change
            </button>
            <button
              onClick={() => setMode(null)}
              className={`opacity-45 ${linkClass}`}
            >
              cancel
            </button>
          </div>
        )}

        {notice && <p className="text-xs correct-text">{notice}</p>}
        {error && <p className="text-xs wrong-text">{error}</p>}
      </div>
    </div>
  );
};

// useSearchParams needs a Suspense boundary for the static build.
const MePageWithBoundary = () => (
  <Suspense fallback={null}>
    <MePage />
  </Suspense>
);

export default MePageWithBoundary;
