
import React from 'react';

interface LetterPotProps {
  letter: string | null;
  isHinted: boolean;
  isCorrect: boolean | null;
  index: number;
  onLetterRemove: () => void;
}

export const LetterPot: React.FC<LetterPotProps> = ({ 
  letter, 
  isHinted, 
  isCorrect,
  index,
  onLetterRemove
}) => {
  // Calculate different styles based on state
  const potClass = letter 
    ? isHinted
      ? 'bg-yellow-500 border-yellow-500 text-white animate-pulse'
      : isCorrect === true
        ? 'bg-green-500 border-green-500 text-white animate-[flip-in_0.5s_ease-out_forwards]'
        : isCorrect === false
          ? 'bg-red-100 border-red-200'
          : 'bg-primary/10 border-primary' 
    : 'bg-primary/5 border-primary/30 hover:bg-primary/10';
        
  // Use animation delay based on index for sequential animations
  const animationDelay = `${index * 100}ms`;
  
  // Pot styling
  const potShape = "rounded-full";
       
  return (
    <div className="m-1 relative">
      <div
        data-pot-index={index}
        className={`
          flex items-center justify-center
          w-16 h-16 md:w-20 md:h-20
          text-2xl md:text-3xl font-bold uppercase
          border-2 ${potShape}
          transition-colors duration-300
          ${potClass}
          overflow-hidden
        `}
        style={{
          animationDelay,
          transform: isCorrect ? 'rotateX(360deg)' : '',
          transitionDelay: isCorrect !== null ? animationDelay : '0ms',
        }}
      >
        {letter && (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={onLetterRemove}
          >
            {letter}
          </div>
        )}
        
        {!letter && (
          <div className="w-8 h-8 md:w-10 md:h-10 opacity-30">
            {/* This is the empty pot shape */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8L6 2H18L21 8H3Z" stroke="currentColor" strokeWidth="2" />
              <path d="M3 8V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
