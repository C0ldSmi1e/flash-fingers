import { content } from "@/constant/content";
import { Content } from "@/types/content";

const getContent = async (): Promise<Content> => {
  const randomIndex = Math.floor(Math.random() * content.length);
  return content[randomIndex];
};

export { getContent };