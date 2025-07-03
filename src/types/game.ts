import { Round } from "@/types/round";
import { Progress } from "@/types/progress";

interface Game {
  id: string;
  startedAt: Date;
  rounds: Round[];
  progress: Progress;
}

export type { Game };