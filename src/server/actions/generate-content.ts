import "server-only";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { contentPool, contentText } from "@/src/config/constants";
import { createContent, getContentPoolStatus } from "@/src/server/actions/content";
import { UpstreamError } from "@/src/server/errors";

const MODEL = openai("gpt-5.4-nano");

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "").trim();

// Today's Wikipedia "In the news" + "Did you know" — free, keyless, and
// different every day. Empty on failure so generation still runs.
const fetchFreshTopics = async (): Promise<string[]> => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "/");
  try {
    const response = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${date}`,
      { headers: { "User-Agent": "flash-fingers/1.0" } },
    );
    if (!response.ok) return [];

    const feed = (await response.json()) as {
      news?: { story?: string }[];
      dyk?: { text?: string }[];
    };
    return [
      ...(feed.news ?? []).map((item) => stripHtml(item.story ?? "")),
      ...(feed.dyk ?? []).map((item) => stripHtml(item.text ?? "")),
    ].filter(Boolean);
  } catch {
    return [];
  }
};

const generateTexts = async (count: number, topics: string[]): Promise<string[]> => {
  const prompt = [
    `Write ${count} distinct sentences for a typing practice game.`,
    `Each sentence: ${contentText.minLength}-${contentText.maxLength} characters, one line,`,
    "plain US-keyboard characters only (no em-dashes, curly quotes, ellipsis",
    "characters or emoji). Keep the tone light and neutral; skip anything violent or tragic.",
    topics.length
      ? `Base each sentence on one of these items, restating the fact or event in plain words:\n${topics.map((t) => `- ${t}`).join("\n")}`
      : "Cover varied everyday topics.",
  ].join("\n");

  try {
    const { output } = await generateText({
      model: MODEL,
      output: Output.object({
        schema: z.object({ sentences: z.array(z.string()) }),
      }),
      prompt,
    });
    return output.sentences;
  } catch (error) {
    throw new UpstreamError(
      error instanceof Error
        ? `Generation failed: ${error.message}`
        : "Generation failed",
    );
  }
};

// In-memory guards; fine for a single instance.
let lastRunAt = 0;
let inFlight = false;

const shouldTopUp = () => {
  const { total, newestCreatedAt } = getContentPoolStatus();
  if (total >= contentPool.maxSize) return false;
  if (total < contentPool.minSize) return true;
  return Date.now() - newestCreatedAt * 1000 > contentPool.staleAfterMs;
};

const topUpContent = async ({ force = false } = {}) => {
  if (inFlight) return { skipped: "in flight" as const };
  if (!force) {
    if (Date.now() - lastRunAt < contentPool.cooldownMs)
      return { skipped: "cooldown" as const };
    if (!shouldTopUp()) return { skipped: "pool healthy" as const };
  }

  inFlight = true;
  lastRunAt = Date.now();
  try {
    const topics = await fetchFreshTopics();
    const texts = await generateTexts(contentPool.batchSize, topics);
    return { topics: topics.length, ...createContent(texts) };
  } finally {
    inFlight = false;
  }
};

export { topUpContent };
