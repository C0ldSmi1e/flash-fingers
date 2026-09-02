import { z } from "zod";

const InputSchema = z.object({
  currentText: z.string(),
  typedCount: z.number().int().nonnegative(),
});

type Input = z.infer<typeof InputSchema>;

export { InputSchema };
export type { Input };
