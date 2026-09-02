"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/src/utils/auth-client";

const SignInPage = () => {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = isRegister
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

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-current default-text bg-transparent font-mono text-sm outline-none focus:opacity-100 opacity-70";

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-mono font-bold default-text">
        {isRegister ? "Create account" : "Sign in"}
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        {isRegister && (
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
        <input
          className={inputClass}
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        {error && <p className="wrong-text text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 px-8 py-2 rounded-lg font-mono correct-text border border-current hover:opacity-70 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {isRegister ? "Sign up" : "Sign in"}
        </button>
      </form>

      <button
        onClick={() => {
          setIsRegister(!isRegister);
          setError(null);
        }}
        className="default-text opacity-60 text-sm hover:opacity-100 transition-opacity cursor-pointer"
      >
        {isRegister ? "Already have an account? Sign in" : "No account? Create one"}
      </button>
    </div>
  );
};

export default SignInPage;
