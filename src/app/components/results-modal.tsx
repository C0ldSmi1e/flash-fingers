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
  onRestart: () => void;
}

const ResultsModal = ({ round, gameProgress, onRestart }: ResultsModalProps) => {
  if (!round.performance) {
    return null;
  }

  const { wonAgainstTarget, targetWpm, finalUserPosition, finalTargetPosition } = round.performance;
  const winnerEmoji = wonAgainstTarget ? "🏆" : "😤";
  const winnerMessage = wonAgainstTarget ? "You Won!" : "You Lost!";
  const winnerColor = wonAgainstTarget ? "text-green-600" : "text-red-600";

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md border-none">
        <DialogHeader>
          <div className="text-center">
            <div className="text-4xl mb-4">{winnerEmoji}</div>
            <DialogTitle className={`text-2xl font-bold mb-2 ${winnerColor}`}>
              {winnerMessage}
            </DialogTitle>
            <p className="text-muted-foreground mb-6">
              Round {gameProgress.totalRounds + 1} Complete!
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mb-6">
          <Card className={`border-2 ${wonAgainstTarget ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {wonAgainstTarget ? "🏆" : "💪"} Battle Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">⚡ Your WPM:</span>
                <Badge variant={wonAgainstTarget ? "default" : "secondary"}>
                  {round.performance.wpm}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🎯 Target WPM:</span>
                <Badge variant="default">{targetWpm.toFixed(1)}</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                📊 Round Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">⏱️ Time:</span>
                <Badge variant="default">{round.performance.totalTime.toFixed(1)}s</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">🎯 Accuracy:</span>
                <Badge variant="default">{round.performance.accuracy}%</Badge>
              </div>
            </CardContent>
          </Card>
          
          {gameProgress.totalRounds > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700">
                  📈 Game Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">📈 Avg WPM:</span>
                  <Badge variant="secondary">{gameProgress.averageWpm}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🏆 Best WPM:</span>
                  <Badge variant="default">{gameProgress.bestWpm}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🎯 Avg Accuracy:</span>
                  <Badge variant="secondary">{gameProgress.averageAccuracy}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🔥 Total Rounds:</span>
                  <Badge variant="default">{gameProgress.totalRounds}</Badge>
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