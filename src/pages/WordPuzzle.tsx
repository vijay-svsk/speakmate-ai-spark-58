
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Volume2, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSound } from "@/lib/useSound";
import WordGuessGame from "@/components/word-puzzle/WordGuessGame";
import WordScrambleGame from "@/components/word-puzzle/WordScrambleGame";
import VocabularyArcade from "@/components/word-puzzle/VocabularyArcade";
import confetti from 'canvas-confetti';

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
    comingSoon: false,
  },
  {
    id: "vocabulary-arcade",
    name: "Vocabulary Arcade",
    description: "Match words with their correct definitions",
    icon: "📚",
    comingSoon: false,
  },
];

const WordPuzzle = () => {
  const { isMuted, toggleMute, playSound } = useSound();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  useEffect(() => {
    // Play sound when component mounts
    playSound('valid');
  }, [playSound]);

  const selectGame = (gameId: string) => {
    if (gameOptions.find(game => game.id === gameId)?.comingSoon) {
      return; // Don't select games marked as coming soon
    }
    setSelectedGame(gameId);
    playSound('keypress');
    
    // Trigger confetti when selecting a game
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 }
    });
  };

  const handleBack = () => {
    setSelectedGame(null);
    playSound('keypress');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Word Puzzles</h1>
            <p className="text-muted-foreground mt-2">
              Fun and challenging word games to improve your English
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Enable sound" : "Mute sound"}
            className="h-10 w-10 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-300"
          >
            {isMuted ? 
              <VolumeX className="h-5 w-5 text-primary" /> : 
              <Volume2 className="h-5 w-5 text-primary" />
            }
          </Button>
        </header>

        {!selectedGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameOptions.map((game) => (
              <Card 
                key={game.id}
                onClick={() => selectGame(game.id)}
                onMouseEnter={() => {
                  setHoveredGame(game.id);
                  playSound('keypress');
                }}
                onMouseLeave={() => setHoveredGame(null)}
                className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-primary/10 ${
                  game.comingSoon ? 'opacity-70' : 'hover:border-primary/30'
                } animate-fade-in ${hoveredGame === game.id ? 'shadow-lg border-primary' : ''}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className={`text-2xl ${hoveredGame === game.id ? 'animate-pulse' : ''}`}>{game.icon}</span>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{game.name}</span>
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
          <div className="mt-4 animate-fade-in">
            {selectedGame === "word-guess" && <WordGuessGame />}
            {selectedGame === "word-scramble" && <WordScrambleGame />}
            {selectedGame === "vocabulary-arcade" && <VocabularyArcade />}
            
            <Button 
              onClick={handleBack} 
              variant="outline"
              className="mt-6 hover:bg-primary/10 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Game Selection
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WordPuzzle;
