
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RotateCcw, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import confetti from 'canvas-confetti';

// Padajalam-style word puzzles with hints
const wordPuzzles = [
  {
    word: "SMILE",
    hints: [
      { type: "definition", text: "A facial expression showing happiness" },
      { type: "jumble", text: "LIMES (rearrange these letters)" },
      { type: "fill", text: "S _ I _ E (fill in the blanks)" }
    ],
    difficulty: "easy"
  },
  {
    word: "HOUSE",
    hints: [
      { type: "definition", text: "A building where people live" },
      { type: "jumble", text: "SUEHO (rearrange these letters)" },
      { type: "clue", text: "Rhymes with 'mouse'" }
    ],
    difficulty: "easy"
  },
  {
    word: "OCEAN",
    hints: [
      { type: "definition", text: "Large body of salt water" },
      { type: "jumble", text: "CANOE (rearrange these letters)" },
      { type: "fill", text: "O _ E _ N (fill in the blanks)" }
    ],
    difficulty: "medium"
  },
  {
    word: "PLANET",
    hints: [
      { type: "definition", text: "Celestial body orbiting a star" },
      { type: "jumble", text: "TALENT (rearrange these letters)" },
      { type: "clue", text: "Earth is one of these" }
    ],
    difficulty: "medium"
  },
  {
    word: "FREEDOM",
    hints: [
      { type: "definition", text: "The state of being free" },
      { type: "jumble", text: "FORMER + D (rearrange FORMER and add D)" },
      { type: "clue", text: "What birds have when they fly" }
    ],
    difficulty: "hard"
  },
  {
    word: "JOURNEY",
    hints: [
      { type: "definition", text: "A long trip or travel" },
      { type: "jumble", text: "ENJOY + R + U (rearrange and combine)" },
      { type: "fill", text: "J _ U _ N _ Y (fill in the blanks)" }
    ],
    difficulty: "hard"
  }
];

const WordGuessGame = () => {
  const { toast } = useToast();
  const [currentPuzzle, setCurrentPuzzle] = useState(wordPuzzles[0]);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealedHints, setRevealedHints] = useState<number[]>([0]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPuzzle]);

  const startNewPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * wordPuzzles.length);
    setCurrentPuzzle(wordPuzzles[randomIndex]);
    setPuzzleIndex(randomIndex);
    setUserAnswer("");
    setRevealedHints([0]);
    setIsCorrect(null);
    setAttempts(0);
  };

  const revealNextHint = () => {
    if (revealedHints.length < currentPuzzle.hints.length) {
      setRevealedHints(prev => [...prev, prev.length]);
      setScore(prev => Math.max(0, prev - 5)); // Penalty for using hints
    }
  };

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.trim().toUpperCase();
    const normalizedWord = currentPuzzle.word.toUpperCase();
    
    setAttempts(prev => prev + 1);
    
    if (normalizedAnswer === normalizedWord) {
      setIsCorrect(true);
      
      // Calculate score based on hints used and attempts
      const hintPenalty = (revealedHints.length - 1) * 10;
      const attemptPenalty = (attempts) * 5;
      const baseScore = currentPuzzle.difficulty === 'hard' ? 50 : 
                       currentPuzzle.difficulty === 'medium' ? 30 : 20;
      const earnedScore = Math.max(10, baseScore - hintPenalty - attemptPenalty);
      
      setScore(prev => prev + earnedScore);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Correct! 🎉",
        description: `You earned ${earnedScore} points!`,
      });
    } else {
      setIsCorrect(false);
      toast({
        title: "Try again!",
        description: "That's not the correct answer. Keep trying!",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const getHintTypeIcon = (type: string) => {
    switch (type) {
      case 'definition': return '📖';
      case 'jumble': return '🔀';
      case 'fill': return '✏️';
      case 'clue': return '💡';
      default: return '❓';
    }
  };

  const getHintTypeLabel = (type: string) => {
    switch (type) {
      case 'definition': return 'Definition';
      case 'jumble': return 'Jumbled Letters';
      case 'fill': return 'Fill in the Blanks';
      case 'clue': return 'Clue';
      default: return 'Hint';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Padajalam Word Puzzle</h2>
          <p className="text-muted-foreground">Solve the word using the given hints</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-primary">
            Score: {score}
          </div>
          <Button
            variant="outline"
            size="sm"
            title="New Puzzle"
            onClick={startNewPuzzle}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">New Puzzle</span>
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-white mb-4">
        <div className="space-y-6">
          {/* Puzzle Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Difficulty: 
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentPuzzle.difficulty === 'hard' ? 'bg-red-100 text-red-600' :
                currentPuzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {currentPuzzle.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Word Length: {currentPuzzle.word.length} letters
            </div>
          </div>

          {/* Hints Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hints:</h3>
            {currentPuzzle.hints.map((hint, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  revealedHints.includes(index) 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getHintTypeIcon(hint.type)}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      {getHintTypeLabel(hint.type)}
                    </div>
                    {revealedHints.includes(index) ? (
                      <p className="text-gray-700 font-mono">{hint.text}</p>
                    ) : (
                      <p className="text-gray-400">Click "Reveal Hint" to unlock</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hint Button */}
          {revealedHints.length < currentPuzzle.hints.length && (
            <Button
              onClick={revealNextHint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Reveal Next Hint (-5 points)
            </Button>
          )}

          {/* Answer Input */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Answer:</h3>
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="text-lg font-mono uppercase"
                disabled={isCorrect === true}
              />
              <Button 
                onClick={checkAnswer}
                disabled={!userAnswer.trim() || isCorrect === true}
                className="px-6"
              >
                Check
              </Button>
            </div>
            
            {/* Result Display */}
            {isCorrect !== null && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Correct! The word is "{currentPuzzle.word}"</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Incorrect. Try again!</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
            <span>Attempts: {attempts}</span>
            <span>Hints Used: {revealedHints.length}/{currentPuzzle.hints.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WordGuessGame;
