"use client";

import { Round } from "@/types/round";
import { Progress } from "@/types/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsModalProps {
  round: Round;
  gameProgress: Progress;
}

const ResultsModal = ({ round, gameProgress }: ResultsModalProps) => {
  if (!round.performance) {
    return null;
  }

  const { wonAgainstTarget, targetWpm } = round.performance;
  const winnerEmoji = wonAgainstTarget ? "🏆" : "😤";
  const winnerMessage = wonAgainstTarget ? "You Won!" : "You Lost!";

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md border-none">
        <DialogHeader>
          <div className="text-center">
            <div className="text-4xl mb-4">{winnerEmoji}</div>
            <DialogTitle className="text-2xl font-bold mb-2">
              {winnerMessage}
            </DialogTitle>
            <p className="text-muted-foreground mb-6">
              Round {gameProgress.totalRounds + 1} Complete!
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {wonAgainstTarget ? "🏆" : "💪"} Battle Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span>⚡ Your WPM:</span>
                <span>{round.performance.wpm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎯 Target WPM:</span>
                <span>{targetWpm.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                📊 Round Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span>⏱️ Time:</span>
                <span>{round.performance.totalTime.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎯 Accuracy:</span>
                <span>{round.performance.accuracy}%</span>
              </div>
            </CardContent>
          </Card>
          
          {gameProgress.totalRounds > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  📈 Game Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>📈 Avg WPM:</span>
                  <span>{gameProgress.averageWpm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🏆 Best WPM:</span>
                  <span>{gameProgress.bestWpm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🎯 Avg Accuracy:</span>
                  <span>{gameProgress.averageAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🔥 Total Rounds:</span>
                  <span>{gameProgress.totalRounds}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="text-center animate-pulse">
            Press any key for next round
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ResultsModal };