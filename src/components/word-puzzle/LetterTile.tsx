
import React from 'react';

interface LetterTileProps {
  letter: string;
  isHinted: boolean;
  isCorrect: boolean | null;
  index: number;
}

export const LetterTile: React.FC<LetterTileProps> = ({ 
  letter, 
  isHinted, 
  isCorrect,
  index 
}) => {
  // Calculate different styles based on state
  const tileClass = isHinted
    ? 'bg-yellow-500 text-white border-yellow-500 animate-pulse'
    : isCorrect === true
      ? 'bg-green-500 text-white border-green-500 animate-[flip-in_0.5s_ease-out_forwards]'
      : isCorrect === false
        ? 'bg-red-100 border-red-200'
        : 'bg-primary/10 border-primary hover:bg-primary/20';
        
  // Use animation delay based on index for sequential animations
  const animationDelay = `${index * 100}ms`;
        
  return (
    <div
      data-letter={letter}
      className={`
        select-none cursor-grab active:cursor-grabbing
        flex items-center justify-center
        w-12 h-16 md:w-16 md:h-20
        text-2xl md:text-3xl font-bold uppercase
        border-2 rounded m-1 
        transition-colors duration-300
        ${tileClass}
      `}
      style={{
        animationDelay,
        transform: isCorrect ? 'rotateX(360deg)' : '',
        transitionDelay: isCorrect !== null ? animationDelay : '0ms',
      }}
    >
      {letter}
    </div>
  );
};
