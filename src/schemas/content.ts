import { z } from "zod";

const ContentSchema = z.object({
  text: z.string().min(1),
  charCount: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
});

type Content = z.infer<typeof ContentSchema>;

export { ContentSchema };
export type { Content };
