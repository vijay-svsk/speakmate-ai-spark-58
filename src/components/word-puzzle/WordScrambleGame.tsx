
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getRandomMidLengthWord, isValidWord, scrambleWord } from "@/lib/word-utils";
import { useSound } from "@/lib/useSound";
import { HelpCircle, RotateCcw, Check } from "lucide-react";
import { LetterTile } from "./LetterTile";
import Sortable from 'sortablejs';

const MAX_HINTS = 2;

export const WordScrambleGame = () => {
  const { toast } = useToast();
  const { playSound } = useSound();
  const [originalWord, setOriginalWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [currentArrangement, setCurrentArrangement] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintedIndexes, setHintedIndexes] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showInvalidAnimation, setShowInvalidAnimation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const tilesContainerRef = useRef<HTMLDivElement>(null);
  const sortableRef = useRef<Sortable | null>(null);
  
  // Initialize a new game
  useEffect(() => {
    startNewGame();
  }, []);

  // Setup sortable when tiles are rendered
  useEffect(() => {
    if (tilesContainerRef.current && currentArrangement.length > 0) {
      // Clean up previous instance if it exists
      if (sortableRef.current) {
        sortableRef.current.destroy();
      }
      
      // Create new sortable instance
      sortableRef.current = Sortable.create(tilesContainerRef.current, {
        animation: 150,
        ghostClass: "bg-primary/20",
        onStart: () => {
          playSound('keypress');
        },
        onEnd: () => {
          playSound('keypress');
          // Update the current arrangement after drag ends
          const newArrangement = Array.from(tilesContainerRef.current?.children || [])
            .map(child => child.getAttribute('data-letter') || '');
          setCurrentArrangement(newArrangement);
        }
      });
    }
    
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [currentArrangement, tilesContainerRef.current]);

  const startNewGame = () => {
    setIsLoading(true);
    
    // Get a random word
    const newWord = getRandomMidLengthWord();
    setOriginalWord(newWord);
    
    // Scramble it and ensure it's different from the original
    let scrambled = scrambleWord(newWord);
    while (scrambled === newWord) {
      scrambled = scrambleWord(newWord);
    }
    
    setScrambledWord(scrambled);
    setCurrentArrangement(scrambled.split(''));
    setHintsUsed(0);
    setHintedIndexes([]);
    setIsCorrect(null);
    setShowInvalidAnimation(false);
    
    console.log("New word:", newWord); // For debugging only
    setIsLoading(false);
  };

  const useHint = () => {
    if (hintsUsed >= MAX_HINTS) {
      toast({
        title: "No hints left",
        description: "You've used all your hints for this puzzle.",
        variant: "destructive",
      });
      return;
    }
    
    // Find an index that hasn't been hinted yet
    const nonHintedIndexes = originalWord.split('').map((_, i) => i)
      .filter(i => !hintedIndexes.includes(i));
      
    if (!nonHintedIndexes.length) return;
    
    // Choose a random non-hinted position
    const hintIndex = nonHintedIndexes[Math.floor(Math.random() * nonHintedIndexes.length)];
    
    // Create a new arrangement with the correct letter at the hinted position
    const newArrangement = [...currentArrangement];
    
    // Find where the correct letter is in the current arrangement
    const correctLetter = originalWord[hintIndex];
    const correctLetterCurrentIndex = currentArrangement.findIndex((letter, i) => 
      letter === correctLetter && !hintedIndexes.includes(i) && 
      currentArrangement.indexOf(letter) === i
    );
    
    if (correctLetterCurrentIndex !== -1) {
      // Swap the letter at hintIndex with the correct letter
      [newArrangement[hintIndex], newArrangement[correctLetterCurrentIndex]] = 
        [newArrangement[correctLetterCurrentIndex], newArrangement[hintIndex]];
      
      setCurrentArrangement(newArrangement);
      setHintsUsed(prev => prev + 1);
      setHintedIndexes(prev => [...prev, hintIndex]);
      
      playSound('valid');
      
      toast({
        title: "Hint used",
        description: `A letter has been placed in its correct position. ${MAX_HINTS - hintsUsed - 1} hints left.`
      });
    }
  };

  const checkAnswer = () => {
    const currentGuess = currentArrangement.join('');
    
    if (currentGuess === originalWord) {
      setIsCorrect(true);
      playSound('win');
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

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Word Scramble</h2>
        <div className="flex gap-2">
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
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-white mb-4">
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            Unscramble the letters to form a valid English word.
            Drag and drop the tiles to rearrange them.
          </p>
          
          {isCorrect && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p className="font-bold text-lg">Congratulations! You solved it!</p>
              <p>The word is: <span className="uppercase font-bold">{originalWord}</span></p>
            </div>
          )}
        </div>
          
        <div 
          className={`flex justify-center my-8 ${showInvalidAnimation ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          ref={tilesContainerRef}
        >
          {currentArrangement.map((letter, index) => (
            <LetterTile 
              key={`${index}-${letter}`}
              letter={letter}
              isHinted={hintedIndexes.includes(index)}
              isCorrect={isCorrect}
              index={index}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            onClick={checkAnswer}
            className="px-8 py-2 flex items-center gap-2"
            disabled={isCorrect !== null && isCorrect}
          >
            <Check className="h-5 w-5" />
            Check Answer
          </Button>
          
          <Button
            onClick={useHint}
            variant="outline"
            className="px-8 py-2 flex items-center gap-2"
            disabled={hintsUsed >= MAX_HINTS || isCorrect === true}
          >
            <HelpCircle className="h-5 w-5" />
            Hint ({MAX_HINTS - hintsUsed} left)
          </Button>
        </div>
        
        {isCorrect === true && (
          <div className="mt-6 flex justify-center">
            <Button onClick={startNewGame} size="lg" className="px-8">
              New Puzzle
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WordScrambleGame;
