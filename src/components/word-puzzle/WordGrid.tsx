import React from "react";

interface WordGridProps {
  guesses: string[];
  currentGuess: string;
  statuses: Array<Array<'correct' | 'present' | 'absent'>>;
  maxAttempts: number;
  wordLength: number;
  showInvalidAnimation: boolean;
}

export const WordGrid: React.FC<WordGridProps> = ({
  guesses,
  currentGuess,
  statuses,
  maxAttempts,
  wordLength,
  showInvalidAnimation,
}) => {
  // Create an empty grid based on max attempts and word length
  const rows = Array(maxAttempts).fill(null);
  
  // Add animation class for invalid words
  const currentRowIndex = guesses.length;
  const invalidClass = showInvalidAnimation && currentRowIndex < maxAttempts 
    ? "animate-[shake_0.5s_ease-in-out]" 
    : "";
  
  return (
    <div className="grid gap-2 w-full max-w-md mx-auto">
      {rows.map((_, rowIndex) => {
        // Determine what to show in this row
        const isCurrentRow = rowIndex === guesses.length;
        const isPastRow = rowIndex < guesses.length;
        
        // If it's a past row, use the submitted guess
        // If it's the current row, use the current input
        // Otherwise, it's an empty future row
        const rowContent = isPastRow 
          ? guesses[rowIndex] 
          : isCurrentRow 
            ? currentGuess 
            : "";
            
        return (
          <div 
            key={`row-${rowIndex}`} 
            className={`grid grid-cols-5 gap-2 mb-2 ${rowIndex === currentRowIndex ? invalidClass : ""}`}
          >
            {Array(wordLength).fill(null).map((_, colIndex) => {
              // Determine the character to display in this cell
              const char = rowContent[colIndex] || "";
              
              // Determine the status of this cell for styling
              let status = null;
              if (isPastRow) {
                status = statuses[rowIndex]?.[colIndex] || null;
              }
              
              // Apply appropriate styles based on cell status
              const cellStateClasses = status 
                ? status === 'correct'
                  ? 'bg-green-500 text-white border-green-500 scale-105'
                  : status === 'present'
                    ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-gray-500 text-white border-gray-500'
                : char 
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-50 border-gray-300';
              
              const animationDelay = `${colIndex * 100}ms`;
                
              return (
                <div 
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`
                    flex items-center justify-center w-full h-14 text-2xl font-bold uppercase
                    border-2 rounded transition-all duration-300
                    ${cellStateClasses}
                  `}
                  style={{
                    animationDelay,
                    transform: status ? 'rotateX(360deg)' : '',
                    transitionDelay: isPastRow ? animationDelay : '0ms',
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
