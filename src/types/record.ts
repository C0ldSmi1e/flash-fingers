import { Content } from "@/types/content";
import { Performance } from "@/types/performance";

interface Record {
  id: string;
  startTime: Date;
  endTime: Date | null;
  isCompleted: boolean;
  performance: Performance | null;
  content: Content;
}

export type { Record };