
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameOverScreenProps {
  hasWon: boolean;
  targetWord: string;
  attempts: number;
  onNewGame: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  hasWon,
  targetWord,
  attempts,
  onNewGame,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {hasWon ? (
        <div className="text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-4">You Won! 🎉</h3>
          <p className="text-xl mb-2">
            Congratulations! You guessed <span className="font-bold uppercase">{targetWord}</span> correctly
            in {attempts} {attempts === 1 ? 'attempt' : 'attempts'}.
          </p>
          <ConfettiEffect />
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-4">Game Over</h3>
          <p className="text-xl mb-2">
            The word was <span className="font-bold uppercase">{targetWord}</span>
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            Better luck next time!
          </p>
        </div>
      )}
      
      <div className="mt-8">
        <Button onClick={onNewGame} size="lg" className="px-8">
          Play Again
        </Button>
      </div>
    </div>
  );
};

const ConfettiEffect: React.FC = () => {
  // In a real app, we would implement a proper confetti effect
  // For now, we'll just render some colorful dots

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className="relative w-full h-24 mb-6">
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDelay = `${Math.random() * 2}s`;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className={`absolute rounded-full ${color} opacity-70 animate-[confetti_3s_ease-in-out_infinite]`}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              animationDelay,
            }}
          />
        );
      })}
    </div>
  );
};
