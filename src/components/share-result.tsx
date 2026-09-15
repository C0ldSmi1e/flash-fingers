"use client";

import { useState } from "react";
import { site } from "@/src/config/constants";
import { Performance } from "@/src/schemas/performance";

interface ShareResultProps {
  performance: Performance;
  isPersonalBest: boolean;
}

// Native share sheet where the browser has one, clipboard everywhere else.
// The result is the thing people brag about, so the message leads with it
// and ends with the link.
const ShareResult = ({ performance, isPersonalBest }: ShareResultProps) => {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const text = [
    isPersonalBest ? "New personal best:" : "I just typed",
    `${performance.wpm} wpm at ${performance.accuracy}% accuracy on ${site.name}.`,
    `Think you're faster? ${site.url}`,
  ].join(" ");

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Keep focus on the hidden input so "press any key" still restarts.
    e.currentTarget.blur();
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch (error) {
      // AbortError is the user closing the share sheet; nothing to report.
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="text-xs font-mono default-text opacity-50 hover:opacity-100 transition-opacity cursor-pointer underline underline-offset-4"
    >
      {state === "copied"
        ? "copied to clipboard"
        : state === "failed"
          ? "could not share"
          : "share your score"}
    </button>
  );
};

export { ShareResult };
