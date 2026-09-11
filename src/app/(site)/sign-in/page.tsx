"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordReset, signIn, signUp } from "@/src/utils/auth-client";

type Mode = "sign-in" | "register" | "forgot";

const titles: Record<Mode, string> = {
  "sign-in": "Sign in",
  register: "Create account",
  forgot: "Reset password",
};

const SignInPage = () => {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    if (mode === "forgot") {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      setIsSubmitting(false);
      if (result.error) {
        setError(result.error.message ?? "Something went wrong");
        return;
      }
      // Same message whether or not the address exists.
      setNotice("If that address has an account, a reset link is on its way.");
      return;
    }

    const result =
      mode === "register"
        ? await signUp.email({ name, email, password })
        : await signIn.email({ email, password });

    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "Something went wrong");
      return;
    }
    router.push("/");
    router.refresh();
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
  const linkClass =
    "default-text opacity-60 text-sm hover:opacity-100 transition-opacity cursor-pointer";

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-mono font-bold default-text">{titles[mode]}</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        {mode === "register" && (
          <input
            className={inputClass}
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className={inputClass}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mode !== "forgot" && (
          <input
            className={inputClass}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        )}

        {error && <p className="wrong-text text-sm text-center">{error}</p>}
        {notice && <p className="correct-text text-sm text-center">{notice}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 px-8 py-2 rounded-lg font-mono correct-text border border-current hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {mode === "register"
            ? "Sign up"
            : mode === "forgot"
              ? "Send reset link"
              : "Sign in"}
        </button>
      </form>

      {mode !== "forgot" && (
        <>
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

      <p className="font-mono text-xs default-text opacity-40 text-center max-w-xs">
        By continuing you agree to the <Link href="/terms">terms</Link> and{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => switchMode(mode === "sign-in" ? "register" : "sign-in")}
          className={linkClass}
        >
          {mode === "sign-in"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </button>
        {mode === "sign-in" && (
          <button onClick={() => switchMode("forgot")} className={linkClass}>
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
