import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Game options with their details
const gameOptions = [
  {
    id: "word-guess",
    name: "Word Guess",
    description: "Guess a 5-letter word in 6 attempts",
    icon: "🎯",
    comingSoon: false,
  },
  {
    id: "word-scramble",
    name: "Word Scramble",
    description: "Unscramble letters to form a valid English word",
    icon: "🔤",
    comingSoon: true,
  },
  {
    id: "vocab-builder",
    name: "Vocab Builder",
    description: "Match words with their correct definitions",
    icon: "📚",
    comingSoon: true,
  },
];

const WordPuzzle = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Here we would implement actual sound toggling with a library like Howler.js
  };

  const selectGame = (gameId: string) => {
    if (gameOptions.find(game => game.id === gameId)?.comingSoon) {
      return; // Don't select games marked as coming soon
    }
    setSelectedGame(gameId);
    // Here we would play a selection sound if sound is enabled
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Word Puzzles</h1>
            <p className="text-muted-foreground mt-1">
              Fun and challenging word games to improve your English
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            title={soundEnabled ? "Mute sound" : "Enable sound"}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            {soundEnabled ? 
              <Volume2 className="h-5 w-5" /> : 
              <VolumeX className="h-5 w-5" />
            }
          </Button>
        </header>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameOptions.map((game) => (
              <Card 
                key={game.id}
                onClick={() => selectGame(game.id)}
                className={`cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg border-primary/10 ${
                  game.comingSoon ? 'opacity-70' : 'hover:border-primary/30'
                } animate-fade-in`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{game.icon}</span>
                    <span>{game.name}</span>
                    {game.comingSoon && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{game.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            {selectedGame === "word-guess" && <WordGuessGame />}
            {/* Other game components would be rendered here when implemented */}
            <Button 
              onClick={() => setSelectedGame(null)} 
              variant="outline"
              className="mt-4"
            >
              Back to Game Selection
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

// Placeholder for the Word Guess game component - to be expanded
const WordGuessGame = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Word Guess</h2>
      <p className="mb-6 text-muted-foreground">
        Try to guess the 5-letter word in 6 attempts. After each guess, the tiles will change color to show how close your guess was.
      </p>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6">
          <p className="text-center text-lg">Game coming soon!</p>
          <p className="text-center text-muted-foreground">
            We're working hard to bring you an amazing word puzzle experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordPuzzle;
