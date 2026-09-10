"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/src/utils/auth-client";

// better-auth validates the emailed token first, then redirects here with
// ?token=... on success or ?error=INVALID_TOKEN when it's expired or bogus.
const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const result = await resetPassword({ newPassword: password, token });

    setIsSubmitting(false);
    if (result.error) {
      setError(result.error.message ?? "Could not reset password");
      return;
    }
    router.push("/sign-in");
  };

  if (!token) {
    return (
      <>
        <p className="wrong-text text-sm text-center max-w-xs">
          {linkError
            ? "This reset link is invalid or has expired."
            : "Missing reset token. Open the link from your email."}
        </p>
        <Link
          href="/sign-in"
          className="default-text opacity-60 text-sm hover:opacity-100 transition-opacity"
        >
          Request a new link
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
      <input
        className="w-full px-4 py-2 rounded-lg border border-current default-text bg-transparent font-mono text-sm outline-none focus:opacity-100 opacity-70"
        type="password"
        placeholder="new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoFocus
      />

      {error && <p className="wrong-text text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 px-8 py-2 rounded-lg font-mono correct-text border border-current hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer"
      >
        Set new password
      </button>
    </form>
  );
};

const ResetPasswordPage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-mono font-bold default-text">Reset password</h1>
      {/* useSearchParams needs a Suspense boundary for the static build. */}
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default ResetPasswordPage;
