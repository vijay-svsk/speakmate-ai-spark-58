
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RotateCcw, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import confetti from 'canvas-confetti';

// Crossword puzzle data
const crosswordPuzzles = [
  {
    id: 1,
    grid: [
      ['C', 'A', 'T', '', '', ''],
      ['A', '', 'H', '', '', ''],
      ['R', '', 'E', '', '', ''],
      ['', '', '', 'D', 'O', 'G'],
      ['', '', '', 'A', '', ''],
      ['', '', '', 'Y', '', '']
    ],
    solution: [
      ['C', 'A', 'T', '', '', ''],
      ['A', '', 'H', '', '', ''],
      ['R', '', 'E', '', '', ''],
      ['', '', '', 'D', 'O', 'G'],
      ['', '', '', 'A', '', ''],
      ['', '', '', 'Y', '', '']
    ],
    hints: {
      horizontal: [
        { number: 1, clue: "Feline pet (3 letters)", row: 0, col: 0, length: 3, answer: "CAT" },
        { number: 4, clue: "Man's best friend (3 letters)", row: 3, col: 3, length: 3, answer: "DOG" }
      ],
      vertical: [
        { number: 1, clue: "Vehicle with four wheels (3 letters)", row: 0, col: 0, length: 3, answer: "CAR" },
        { number: 2, clue: "Definite article (3 letters)", row: 0, col: 2, length: 3, answer: "THE" },
        { number: 4, clue: "Period of 24 hours (3 letters)", row: 3, col: 3, length: 3, answer: "DAY" }
      ]
    }
  },
  {
    id: 2,
    grid: [
      ['S', 'U', 'N', '', '', ''],
      ['', '', 'O', '', '', ''],
      ['', '', '', 'B', 'O', 'X'],
      ['', '', '', 'I', '', ''],
      ['', '', '', 'G', '', ''],
      ['F', 'I', 'S', 'H', '', '']
    ],
    solution: [
      ['S', 'U', 'N', '', '', ''],
      ['', '', 'O', '', '', ''],
      ['', '', '', 'B', 'O', 'X'],
      ['', '', '', 'I', '', ''],
      ['', '', '', 'G', '', ''],
      ['F', 'I', 'S', 'H', '', '']
    ],
    hints: {
      horizontal: [
        { number: 1, clue: "Bright star in our solar system (3 letters)", row: 0, col: 0, length: 3, answer: "SUN" },
        { number: 3, clue: "Container or package (3 letters)", row: 2, col: 3, length: 3, answer: "BOX" },
        { number: 6, clue: "Aquatic animal (4 letters)", row: 5, col: 0, length: 4, answer: "FISH" }
      ],
      vertical: [
        { number: 2, clue: "Negative word (2 letters)", row: 0, col: 2, length: 2, answer: "NO" },
        { number: 3, clue: "Large or great in size (3 letters)", row: 2, col: 3, length: 3, answer: "BIG" }
      ]
    }
  },
  {
    id: 3,
    grid: [
      ['', '', 'T', 'R', 'E', 'E'],
      ['', '', 'O', '', '', ''],
      ['H', 'O', 'P', '', '', ''],
      ['A', '', '', '', '', ''],
      ['T', '', '', '', '', ''],
      ['', '', '', 'A', 'G', 'E']
    ],
    solution: [
      ['', '', 'T', 'R', 'E', 'E'],
      ['', '', 'O', '', '', ''],
      ['H', 'O', 'P', '', '', ''],
      ['A', '', '', '', '', ''],
      ['T', '', '', '', '', ''],
      ['', '', '', 'A', 'G', 'E']
    ],
    hints: {
      horizontal: [
        { number: 1, clue: "Large plant with trunk (4 letters)", row: 0, col: 2, length: 4, answer: "TREE" },
        { number: 3, clue: "Jump on one foot (3 letters)", row: 2, col: 0, length: 3, answer: "HOP" },
        { number: 6, clue: "How old you are (3 letters)", row: 5, col: 3, length: 3, answer: "AGE" }
      ],
      vertical: [
        { number: 2, clue: "Preposition meaning 'towards' (2 letters)", row: 0, col: 2, length: 2, answer: "TO" },
        { number: 3, clue: "Head covering (3 letters)", row: 2, col: 0, length: 3, answer: "HAT" }
      ]
    }
  }
];

const WordGuessGame = () => {
  const { toast } = useToast();
  const [currentPuzzle, setCurrentPuzzle] = useState(crosswordPuzzles[0]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [score, setScore] = useState(0);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, [currentPuzzle]);

  const initializeGrid = () => {
    const grid = Array(6).fill(null).map(() => Array(6).fill(''));
    setUserGrid(grid);
    setCompletedWords(new Set());
    setSelectedCell(null);
  };

  const startNewPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * crosswordPuzzles.length);
    setCurrentPuzzle(crosswordPuzzles[randomIndex]);
    setPuzzleIndex(randomIndex);
    setScore(0);
    setShowHints(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (currentPuzzle.solution[row][col] !== '') {
      setSelectedCell({ row, col });
    }
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
      const newGrid = [...userGrid];
      newGrid[row][col] = value.toUpperCase();
      setUserGrid(newGrid);
      checkWordCompletion(newGrid);
    }
  };

  const checkWordCompletion = (grid: string[][]) => {
    const newCompletedWords = new Set<string>();
    
    // Check horizontal words
    currentPuzzle.hints.horizontal.forEach(hint => {
      let word = '';
      for (let i = 0; i < hint.length; i++) {
        word += grid[hint.row][hint.col + i] || '';
      }
      if (word === hint.answer) {
        newCompletedWords.add(`h-${hint.number}`);
      }
    });

    // Check vertical words
    currentPuzzle.hints.vertical.forEach(hint => {
      let word = '';
      for (let i = 0; i < hint.length; i++) {
        word += grid[hint.row + i][hint.col] || '';
      }
      if (word === hint.answer) {
        newCompletedWords.add(`v-${hint.number}`);
      }
    });

    setCompletedWords(newCompletedWords);

    // Check if puzzle is complete
    const totalWords = currentPuzzle.hints.horizontal.length + currentPuzzle.hints.vertical.length;
    if (newCompletedWords.size === totalWords) {
      setScore(prev => prev + 100);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Puzzle Complete! 🎉",
        description: "You solved the crossword puzzle!",
      });
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
    if (!showHints) {
      setScore(prev => Math.max(0, prev - 20));
    }
  };

  const getCellNumber = (row: number, col: number) => {
    // Check if this cell is the start of a horizontal word
    const horizontalHint = currentPuzzle.hints.horizontal.find(
      hint => hint.row === row && hint.col === col
    );
    
    // Check if this cell is the start of a vertical word
    const verticalHint = currentPuzzle.hints.vertical.find(
      hint => hint.row === row && hint.col === col
    );

    if (horizontalHint) return horizontalHint.number;
    if (verticalHint) return verticalHint.number;
    return null;
  };

  const isCellActive = (row: number, col: number) => {
    return currentPuzzle.solution[row][col] !== '';
  };

  const isCellCorrect = (row: number, col: number) => {
    if (!userGrid[row] || !userGrid[row][col]) return false;
    return userGrid[row][col] === currentPuzzle.solution[row][col];
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Crossword Puzzle</h2>
          <p className="text-muted-foreground">Fill the grid using the numbered hints</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-primary">
            Score: {score}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHints}
            className="flex items-center gap-1"
          >
            <Lightbulb className="h-4 w-4" />
            {showHints ? "Hide" : "Show"} Hints (-20 points)
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grid */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">6×6 Crossword Grid</h3>
          <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
            {Array(6).fill(null).map((_, row) =>
              Array(6).fill(null).map((_, col) => {
                const isActive = isCellActive(row, col);
                const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                const isCorrect = isCellCorrect(row, col);
                const cellNumber = getCellNumber(row, col);
                
                return (
                  <div
                    key={`${row}-${col}`}
                    className={`
                      relative w-12 h-12 border-2 transition-all duration-200
                      ${isActive 
                        ? isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : isCorrect 
                            ? 'border-green-400 bg-green-50'
                            : 'border-gray-300 bg-white hover:border-blue-300 cursor-pointer'
                        : 'bg-gray-200 border-gray-400'
                      }
                    `}
                    onClick={() => handleCellClick(row, col)}
                  >
                    {cellNumber && (
                      <span className="absolute top-0 left-0 text-xs font-bold text-blue-600 leading-none p-0.5">
                        {cellNumber}
                      </span>
                    )}
                    {isActive && (
                      <Input
                        value={userGrid[row]?.[col] || ''}
                        onChange={(e) => handleCellChange(row, col, e.target.value)}
                        className="w-full h-full border-0 text-center text-lg font-bold uppercase p-0 focus:ring-0 focus:outline-none bg-transparent"
                        maxLength={1}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Words completed: {completedWords.size} / {currentPuzzle.hints.horizontal.length + currentPuzzle.hints.vertical.length}
            </p>
          </div>
        </Card>

        {/* Hints */}
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold mb-4">Clues</h3>
          
          {showHints && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-600 mb-2">ACROSS</h4>
                <div className="space-y-2">
                  {currentPuzzle.hints.horizontal.map((hint) => (
                    <div 
                      key={`h-${hint.number}`}
                      className={`flex items-start gap-2 p-2 rounded ${
                        completedWords.has(`h-${hint.number}`) 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50'
                      }`}
                    >
                      {completedWords.has(`h-${hint.number}`) && (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="font-medium">{hint.number}.</span>
                      <span>{hint.clue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-purple-600 mb-2">DOWN</h4>
                <div className="space-y-2">
                  {currentPuzzle.hints.vertical.map((hint) => (
                    <div 
                      key={`v-${hint.number}`}
                      className={`flex items-start gap-2 p-2 rounded ${
                        completedWords.has(`v-${hint.number}`) 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50'
                      }`}
                    >
                      {completedWords.has(`v-${hint.number}`) && (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="font-medium">{hint.number}.</span>
                      <span>{hint.clue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!showHints && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Click "Show Hints" to reveal the clues for this puzzle
              </p>
              <Button onClick={toggleHints} variant="outline">
                Show Hints
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WordGuessGame;
