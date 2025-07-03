"use client";

import { Round } from "@/types/round";
import { Progress } from "@/types/progress";

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
  const bgColor = wonAgainstTarget ? "bg-green-50" : "bg-red-50";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center animate-in fade-in duration-300">
        <div className="text-4xl mb-4">{winnerEmoji}</div>
        <h2 className={`text-2xl font-bold mb-2 ${winnerColor}`}>{winnerMessage}</h2>
        <p className="text-gray-600 mb-6">Round {gameProgress.totalRounds + 1} Complete!</p>
        
        <div className="space-y-4 mb-6">
          <div className={`${bgColor} p-4 rounded-lg border-2 ${wonAgainstTarget ? 'border-green-200' : 'border-red-200'}`}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Battle Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">⚡ Your WPM:</span>
                <span className="font-semibold">{round.performance.wpm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🎯 Target WPM:</span>
                <span className="font-semibold">{targetWpm.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">📍 Final Position:</span>
                <span className="font-semibold">{finalUserPosition} vs {finalTargetPosition}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Round Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">⏱️ Time:</span>
                <span className="font-semibold">{round.performance.totalTime.toFixed(1)}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🎯 Accuracy:</span>
                <span className="font-semibold">{round.performance.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">📊 Characters:</span>
                <span className="font-semibold">{round.performance.charCount}/{round.content.text.length}</span>
              </div>
            </div>
          </div>
          
          {gameProgress.totalRounds > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700 mb-2">Game Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">📈 Avg WPM:</span>
                  <span className="font-semibold">{gameProgress.averageWpm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🏆 Best WPM:</span>
                  <span className="font-semibold">{gameProgress.bestWpm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🎯 Avg Accuracy:</span>
                  <span className="font-semibold">{gameProgress.averageAccuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">🔥 Total Rounds:</span>
                  <span className="font-semibold">{gameProgress.totalRounds}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-gray-500 text-sm animate-pulse">
          Press any key for next round
        </div>
      </div>
    </div>
  );
};

export { ResultsModal };