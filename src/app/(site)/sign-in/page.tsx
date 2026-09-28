"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient, signIn, useSession } from "@/src/utils/auth-client";

type Step = "email" | "code" | "name";

const titles: Record<Step, string> = {
  email: "Sign in",
  code: "Check your email",
  name: "Pick a name",
};

// The plugin's own messages say "OTP"; players get plain words instead.
const codeErrors: Record<string, string> = {
  INVALID_OTP: "That code isn't right.",
  OTP_EXPIRED: "That code has expired. Send a new one.",
  TOO_MANY_ATTEMPTS: "Too many tries. Send a new code.",
};

const SignInPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New accounts start nameless; anyone who left before naming lands here.
  const current: Step = session && !session.user.name.trim() ? "name" : step;

  const goTo = (next: Step) => {
    setStep(next);
    setError(null);
    setNotice(null);
  };

  const finish = () => {
    router.push("/");
    router.refresh();
  };

  const sendCode = async () => {
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    const result = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim(),
      type: "sign-in",
    });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "Could not send a code");
      return false;
    }
    return true;
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await sendCode()) {
      setCode("");
      goTo("code");
    }
  };

  const handleResend = async () => {
    if (await sendCode()) {
      setNotice("New code sent");
    }
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    const result = await signIn.emailOtp({ email: email.trim(), otp: code.trim() });
    setIsSubmitting(false);
    if (result.error) {
      setError(
        codeErrors[result.error.code ?? ""] ??
          result.error.message ??
          "Could not sign in",
      );
      return;
    }
    if (!result.data.user.name.trim()) {
      goTo("name");
      return;
    }
    finish();
  };

  const handleName = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await authClient.updateUser({ name: name.trim() });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "Could not save your name");
      return;
    }
    // Hold this step while navigating; the refreshed session has a name now.
    setStep("name");
    finish();
  };

  const handleGoogle = async () => {
    setError(null);
    setIsSubmitting(true);
    // Redirects to Google; on success better-auth lands the user on "/".
    const result = await signIn.social({ provider: "google", callbackURL: "/" });
    if (result.error) {
      setIsSubmitting(false);
      setError(result.error.message ?? "Google sign-in failed");
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-current default-text bg-transparent font-mono text-sm outline-none focus:opacity-100 opacity-70";
  const buttonClass =
    "mt-2 px-8 py-2 rounded-lg font-mono correct-text border border-current hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer";
  const linkClass =
    "default-text opacity-60 text-sm hover:opacity-100 transition-opacity cursor-pointer";
  const hintClass = "default-text opacity-60 text-sm text-center max-w-xs -mt-3";

  const messages = (
    <>
      {error && <p className="wrong-text text-sm text-center">{error}</p>}
      {notice && <p className="correct-text text-sm text-center">{notice}</p>}
    </>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-mono font-bold default-text">
        {titles[current]}
      </h1>

      {current === "email" && (
        <>
          <p className={hintClass}>New here? The same code creates your account.</p>
          <form
            onSubmit={handleEmail}
            className="w-full max-w-xs flex flex-col gap-3"
          >
            <input
              className={inputClass}
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
            {messages}
            <button type="submit" disabled={isSubmitting} className={buttonClass}>
              Send code
            </button>
          </form>

          <div className="w-full max-w-xs flex items-center gap-3 default-text opacity-40 text-xs font-mono">
            <span className="grow border-t border-current" />
            or
            <span className="grow border-t border-current" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="w-full max-w-xs px-8 py-2 rounded-lg font-mono default-text border border-current hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer"
          >
            Continue with Google
          </button>
        </>
      )}

      {current === "code" && (
        <>
          <p className={hintClass}>We sent a code to {email.trim()}</p>
          <form
            onSubmit={handleCode}
            className="w-full max-w-xs flex flex-col gap-3"
          >
            <input
              className={`${inputClass} text-center tracking-[.3em]`}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
            {messages}
            <button type="submit" disabled={isSubmitting} className={buttonClass}>
              Continue
            </button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleResend}
              disabled={isSubmitting}
              className={linkClass}
            >
              Send a new code
            </button>
            <button onClick={() => goTo("email")} className={linkClass}>
              Use a different email
            </button>
          </div>
        </>
      )}

      {current === "name" && (
        <>
          <p className={hintClass}>
            It shows on the leaderboard. You can change it later.
          </p>
          <form
            onSubmit={handleName}
            className="w-full max-w-xs flex flex-col gap-3"
          >
            <input
              className={inputClass}
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="nickname"
              required
              autoFocus
            />
            {messages}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={buttonClass}
            >
              Continue
            </button>
          </form>
        </>
      )}

      <p className="font-mono text-xs default-text opacity-40 text-center max-w-xs">
        By continuing you agree to the <Link href="/terms">terms</Link> and{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </div>
  );
};

export default SignInPage;
