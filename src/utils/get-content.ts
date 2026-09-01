import { content } from "@/src/constant/content";
import { Content } from "@/src/schemas/content";

const getContent = async (): Promise<Content> => {
  const randomIndex = Math.floor(Math.random() * content.length);
  return content[randomIndex];
};

export { getContent };
