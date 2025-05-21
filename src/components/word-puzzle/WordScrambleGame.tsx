import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDifficultyWordList, getRandomWordByDifficulty, scrambleWord } from "@/lib/word-utils";
import { useSound } from "@/lib/useSound";
import { HelpCircle, RotateCcw, Check, Star, Trophy, Volume2, VolumeX } from "lucide-react";
import { LetterTile } from "./LetterTile";
import Sortable from 'sortablejs';
import { LetterPot } from "./LetterPot";
import { DifficultySelector } from "./DifficultySelector";
import { GameOverScreen } from "./GameOverScreen";

// Define difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

const MAX_HINTS = {
  easy: 3,
  medium: 2,
  hard: 0
};

const WordScrambleGame = () => {
  const { toast } = useToast();
  const { playSound, isMuted, toggleMute } = useSound();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [originalWord, setOriginalWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [currentArrangement, setCurrentArrangement] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintedIndexes, setHintedIndexes] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showInvalidAnimation, setShowInvalidAnimation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [puzzlesSolved, setPuzzlesSolved] = useState<number>(0);
  const [potArrangement, setPotArrangement] = useState<(string | null)[]>([]);
  
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const potsContainerRef = useRef<HTMLDivElement>(null);
  const tilesSortableRef = useRef<Sortable | null>(null);
  
  // Initialize a new game when difficulty changes
  useEffect(() => {
    if (difficulty) {
      startNewGame();
    }
  }, [difficulty]);

  // Setup sortable for tiles when they're rendered
  useEffect(() => {
    if (tilesContainerRef.current && currentArrangement.length > 0) {
      // Clean up previous instance if it exists
      if (tilesSortableRef.current) {
        tilesSortableRef.current.destroy();
      }
      
      // Create new sortable instance for tiles
      tilesSortableRef.current = Sortable.create(tilesContainerRef.current, {
        animation: 150,
        ghostClass: "bg-primary/20",
        group: {
          name: "letters",
          pull: "clone",
          put: false
        },
        sort: false,
        onStart: () => {
          playSound('keypress');
        },
        onEnd: (evt) => {
          // Handle drag from tiles to pots
          if (evt.to !== evt.from) {
            playSound('valid');
            const letter = evt.item.getAttribute('data-letter') || '';
            const potIndex = Array.from(evt.to.children).indexOf(evt.item);
            
            // Update the pot arrangement
            const newPotArrangement = [...potArrangement];
            newPotArrangement[potIndex] = letter;
            setPotArrangement(newPotArrangement);
            
            // Remove the item from the pot and back to the tiles (we'll show it in the pot separately)
            evt.item.remove();
          }
        }
      });
      
      // Initialize sortable for the pots container
      if (potsContainerRef.current && originalWord) {
        // Make each pot a dropzone
        Array.from(potsContainerRef.current.children).forEach((pot, index) => {
          Sortable.create(pot as HTMLElement, {
            group: {
              name: "pots",
              put: ["letters"]
            },
            animation: 150,
            onAdd: (evt) => {
              // Get the letter from the dragged tile
              const letter = evt.item.getAttribute('data-letter') || '';
              
              // Update the pot arrangement
              const newPotArrangement = [...potArrangement];
              newPotArrangement[index] = letter;
              setPotArrangement(newPotArrangement);
              
              // Check if the pot already had a letter (remove from the old pot)
              if (potArrangement[index] !== null) {
                // Return the old letter to the tiles
                const newArrangement = [...currentArrangement];
                newArrangement.push(potArrangement[index]!);
                setCurrentArrangement(newArrangement);
              }
              
              // Remove the item from the DOM (we'll show it in the pot with our own component)
              evt.item.remove();
              
              // Play drop sound
              playSound('valid');
            }
          });
        });
      }
    }
    
    return () => {
      if (tilesSortableRef.current) {
        tilesSortableRef.current.destroy();
        tilesSortableRef.current = null;
      }
    };
  }, [currentArrangement, tilesContainerRef.current, potsContainerRef.current, originalWord]);

  const startNewGame = () => {
    if (!difficulty) return;
    
    setIsLoading(true);
    
    // Get a random word based on difficulty
    const newWord = getRandomWordByDifficulty(difficulty);
    setOriginalWord(newWord);
    
    // Scramble it and ensure it's different from the original
    let scrambled = scrambleWord(newWord, difficulty);
    while (scrambled === newWord) {
      scrambled = scrambleWord(newWord, difficulty);
    }
    
    setScrambledWord(scrambled);
    setCurrentArrangement(scrambled.split(''));
    setPotArrangement(Array(newWord.length).fill(null));
    setHintsUsed(0);
    setHintedIndexes([]);
    setIsCorrect(null);
    setShowInvalidAnimation(false);
    
    console.log("New word:", newWord); // For debugging only
    setIsLoading(false);
  };

  const resetDifficulty = () => {
    setDifficulty(null);
    setPuzzlesSolved(0);
  }

  const useHint = () => {
    if (!difficulty) return;
    
    const maxHints = MAX_HINTS[difficulty];
    if (hintsUsed >= maxHints) {
      toast({
        title: "No hints left",
        description: `You've used all your ${maxHints} hints for this puzzle.`,
        variant: "destructive",
      });
      return;
    }
    
    // Find an index that hasn't been hinted yet
    const nonHintedIndexes = originalWord.split('').map((_, i) => i)
      .filter(i => !hintedIndexes.includes(i) && !potArrangement[i]);
      
    if (!nonHintedIndexes.length) {
      toast({
        title: "No more hints needed",
        description: "Try filling in the remaining spots yourself!",
      });
      return;
    }
    
    // Choose a random non-hinted position
    const hintIndex = nonHintedIndexes[Math.floor(Math.random() * nonHintedIndexes.length)];
    
    // Get the correct letter for this position
    const correctLetter = originalWord[hintIndex];
    
    // Find this letter in the current arrangement and remove it
    const letterIndex = currentArrangement.findIndex(letter => letter === correctLetter);
    
    if (letterIndex !== -1) {
      // Remove the letter from tiles
      const newArrangement = [...currentArrangement];
      newArrangement.splice(letterIndex, 1);
      setCurrentArrangement(newArrangement);
      
      // Place it in the correct pot
      const newPotArrangement = [...potArrangement];
      newPotArrangement[hintIndex] = correctLetter;
      setPotArrangement(newPotArrangement);
      
      // Update hint tracking
      setHintsUsed(prev => prev + 1);
      setHintedIndexes(prev => [...prev, hintIndex]);
      
      playSound('valid');
      
      toast({
        title: "Hint used",
        description: `A letter has been placed in its correct position. ${maxHints - hintsUsed - 1} hints left.`
      });
    }
  };

  const checkAnswer = () => {
    // Join the pot arrangement to form the current guess
    const currentGuess = potArrangement.join('');
    
    // Check if all pots are filled
    if (potArrangement.includes(null)) {
      toast({
        title: "Incomplete word",
        description: "Fill all the letter pots before checking your answer.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentGuess === originalWord) {
      setIsCorrect(true);
      playSound('win');
      setPuzzlesSolved(prev => prev + 1);
      
      toast({
        title: "Correct!",
        description: "You've unscrambled the word successfully!"
      });
    } else {
      setIsCorrect(false);
      setShowInvalidAnimation(true);
      playSound('invalid');
      
      // Reset animation state after animation completes
      setTimeout(() => setShowInvalidAnimation(false), 800);
      
      toast({
        title: "Not quite right",
        description: "Keep trying to unscramble the word.",
        variant: "destructive",
      });
    }
  };

  const resetFromPot = (index: number) => {
    if (potArrangement[index] !== null) {
      // Return the letter to the tiles
      const newArrangement = [...currentArrangement];
      newArrangement.push(potArrangement[index]!);
      setCurrentArrangement(newArrangement);
      
      // Clear the pot
      const newPotArrangement = [...potArrangement];
      newPotArrangement[index] = null;
      setPotArrangement(newPotArrangement);
      
      playSound('keypress');
    }
  };

  // If no difficulty is selected, show difficulty selector
  if (difficulty === null) {
    return (
      <DifficultySelector onSelectDifficulty={setDifficulty} />
    );
  }

  // If game is completed, show game over screen
  if (isCorrect === true) {
    return (
      <GameOverScreen 
        hasWon={true}
        targetWord={originalWord}
        difficulty={difficulty}
        puzzlesSolved={puzzlesSolved}
        onPlayAgain={startNewGame}
        onChangeDifficulty={resetDifficulty}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Word Scramble</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            
            <span className="text-sm text-muted-foreground">
              Puzzles solved: {puzzlesSolved}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            title={isMuted ? "Enable sound" : "Mute sound"}
            onClick={toggleMute}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            title="New Puzzle"
            onClick={startNewGame}
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Puzzle</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetDifficulty}
            className="flex items-center gap-1"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Change Level</span>
          </Button>
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-white mb-4">
        <div className="mb-4 text-center">
          <p className="text-muted-foreground">
            Drag the letters into the pots to form a valid English word.
          </p>
        </div>
          
        {/* Letter Pots (Destination) */}
        <div 
          className={`flex justify-center flex-wrap my-8 ${showInvalidAnimation ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          ref={potsContainerRef}
        >
          {potArrangement.map((letter, index) => (
            <LetterPot 
              key={`pot-${index}`}
              letter={letter}
              isHinted={hintedIndexes.includes(index)}
              isCorrect={isCorrect}
              index={index}
              onLetterRemove={() => resetFromPot(index)}
            />
          ))}
        </div>

        {/* Letter Tiles (Source) */}
        <div 
          className="flex justify-center flex-wrap my-6"
          ref={tilesContainerRef}
        >
          {currentArrangement.map((letter, index) => (
            <LetterTile 
              key={`tile-${index}-${letter}`}
              letter={letter}
              isHinted={false}
              isCorrect={isCorrect}
              index={index}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            onClick={checkAnswer}
            className="px-8 py-2 flex items-center gap-2"
            disabled={isCorrect === true}
          >
            <Check className="h-5 w-5" />
            Check Answer
          </Button>
          
          {MAX_HINTS[difficulty] > 0 && (
            <Button
              onClick={useHint}
              variant="outline"
              className="px-8 py-2 flex items-center gap-2"
              disabled={hintsUsed >= MAX_HINTS[difficulty] || isCorrect === true}
            >
              <HelpCircle className="h-5 w-5" />
              Hint ({MAX_HINTS[difficulty] - hintsUsed} left)
            </Button>
          )}
        </div>
        
        {/* Progress stars */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(puzzlesSolved, 5) }).map((_, i) => (
              <Star 
                key={i} 
                className="h-6 w-6 text-yellow-400 fill-yellow-400 animate-[scale-in_0.3s_ease-out]" 
              />
            ))}
            {puzzlesSolved > 5 && (
              <span className="text-sm font-medium text-yellow-600">+{puzzlesSolved - 5}</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WordScrambleGame;
