import { z } from "zod";

const ContentSchema = z.object({
  id: z.number().int().positive(),
  text: z.string().min(1),
  charCount: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
});

const contentQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(1),
});

type Content = z.infer<typeof ContentSchema>;

export { ContentSchema, contentQuerySchema };
export type { Content };
