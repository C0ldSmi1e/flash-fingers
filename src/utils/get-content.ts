import { api } from "@/src/utils/api";
import { ContentSchema, type Content } from "@/src/schemas/content";

const getContent = async (): Promise<Content> => {
  const data = await api<Content[]>("/api/content", { cache: "no-store" });
  return ContentSchema.parse(data[0]);
};

export { getContent };
