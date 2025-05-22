import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getRandomWord, isValidWord, checkWordGuess, generateKeyboardStatus } from "@/lib/word-utils";
import { WordGrid } from "@/components/word-puzzle/WordGrid";
import { Keyboard } from "@/components/word-puzzle/Keyboard";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { GameOverScreen } from "@/components/word-puzzle/GameOverScreen";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

export const WordGuessGame = () => {
  const { toast } = useToast();
  const [targetWord, setTargetWord] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Array<Array<'correct' | 'present' | 'absent'>>>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showInvalidAnimation, setShowInvalidAnimation] = useState<boolean>(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Initialize game with a random word
  useEffect(() => {
    startNewGame();
  }, []);

  // Setup keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, isGameOver]);

  const startNewGame = () => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setCurrentGuess("");
    setGuesses([]);
    setStatuses([]);
    setIsGameOver(false);
    setHasWon(false);
    console.log("New word:", newWord); // For debugging only
  };

  const handleKeyPress = (key: string) => {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  const handleBackspace = () => {
    if (currentGuess.length > 0) {
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
  };

  const submitGuess = async () => {
    // Don't allow submission if the game is over or we're already submitting
    if (isGameOver || isSubmitting) return;
    
    // Check if the guess is complete
    if (currentGuess.length !== WORD_LENGTH) {
      toast({
        title: "Word too short",
        description: `Your guess must be ${WORD_LENGTH} letters long.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if the guess is a valid word
    if (!isValidWord(currentGuess)) {
      setShowInvalidAnimation(true);
      
      // Reset animation state after animation completes
      setTimeout(() => setShowInvalidAnimation(false), 800);
      
      toast({
        title: "Not in word list",
        description: "Please enter a valid English word.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Get statuses for the current guess
    const newStatus = checkWordGuess(currentGuess, targetWord);
    
    // Update game state
    const newGuesses = [...guesses, currentGuess];
    const newStatuses = [...statuses, newStatus];
    
    setGuesses(newGuesses);
    setStatuses(newStatuses);
    setCurrentGuess("");
    
    // Check if the player won
    if (currentGuess.toLowerCase() === targetWord.toLowerCase()) {
      setHasWon(true);
      setIsGameOver(true);
      toast({
        title: "You won! 🎉",
        description: `You guessed the word in ${newGuesses.length} ${newGuesses.length === 1 ? 'try' : 'tries'}!`,
      });
    }
    // Check if the player lost
    else if (newGuesses.length >= MAX_ATTEMPTS) {
      setIsGameOver(true);
      toast({
        title: "Game Over",
        description: `The word was "${targetWord}".`,
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const keyboardStatus = generateKeyboardStatus(guesses, statuses);
  
  // Scroll to top whenever game over state changes
  useEffect(() => {
    if (isGameOver && gameContainerRef.current) {
      gameContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isGameOver]);

  return (
    <div ref={gameContainerRef} className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Word Guess</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            title="New Game"
            onClick={startNewGame}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Game</span>
          </Button>
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-white mb-4">
        <p className="mb-4 text-muted-foreground">
          Try to guess the 5-letter word in 6 attempts. After each guess, the tiles will
          show how close your guess was to the word.
        </p>

        {isGameOver ? (
          <GameOverScreen 
            hasWon={hasWon} 
            targetWord={targetWord} 
            attempts={guesses.length} 
            onPlayAgain={startNewGame}
          />
        ) : (
          <div className="flex flex-col items-center">
            <WordGrid 
              guesses={guesses} 
              currentGuess={currentGuess} 
              statuses={statuses}
              maxAttempts={MAX_ATTEMPTS}
              wordLength={WORD_LENGTH}
              showInvalidAnimation={showInvalidAnimation}
            />
            
            <div className="w-full max-w-md mt-6">
              <Keyboard 
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onEnter={submitGuess}
                keyStatus={keyboardStatus}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WordGuessGame;
