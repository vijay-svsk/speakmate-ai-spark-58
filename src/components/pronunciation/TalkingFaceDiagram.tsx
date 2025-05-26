
import React, { useEffect, useState } from "react";

interface TalkingFaceDiagramProps {
  word: string;
  isAnimating: boolean;
  phoneme?: string;
}

export const TalkingFaceDiagram: React.FC<TalkingFaceDiagramProps> = ({
  word,
  isAnimating,
  phoneme
}) => {
  const [isTalking, setIsTalking] = useState(false);
  const [currentPhoneme, setCurrentPhoneme] = useState("");

  // Handle direct phoneme selection (syllable click)
  useEffect(() => {
    if (phoneme && !isAnimating) {
      setCurrentPhoneme(phoneme);
      setIsTalking(true);
      
      // Return to default after 800ms
      setTimeout(() => {
        setIsTalking(false);
      }, 800);
    }
  }, [phoneme, isAnimating]);

  // Handle word animation (when "Listen" button is pressed)
  useEffect(() => {
    if (!isAnimating || !word) {
      setIsTalking(false);
      return;
    }

    // Simulate talking animation by toggling mouth state
    setIsTalking(true);
    
    const talkingInterval = setInterval(() => {
      setIsTalking(prev => !prev);
    }, 300);

    // Stop talking after 3 seconds
    setTimeout(() => {
      clearInterval(talkingInterval);
      setIsTalking(false);
    }, 3000);

    return () => clearInterval(talkingInterval);
  }, [isAnimating, word]);

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
      
      {/* Phoneme indicator */}
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-mono text-center backdrop-blur-sm">
          {currentPhoneme ? `Sound: /${currentPhoneme}/` : "Click a syllable"}
        </div>
      </div>

      {/* Main face area */}
      <div className="absolute inset-0 pt-12 pb-16 px-4 flex items-center justify-center">
        <div className={`w-full max-w-xs transition-transform duration-200 ${isTalking ? 'scale-105' : 'scale-100'}`}>
          
          {/* Face Container */}
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-8 backdrop-blur-sm shadow-lg border-4 border-primary/20">
            
            {/* Face SVG */}
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="w-full h-full"
            >
              {/* Face outline */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="#ffe0cc"
                stroke="#e0a580"
                strokeWidth="3"
              />
              
              {/* Eyes */}
              <ellipse cx="70" cy="80" rx="12" ry="15" fill="#333" />
              <ellipse cx="130" cy="80" rx="12" ry="15" fill="#333" />
              
              {/* Eye highlights */}
              <ellipse cx="75" cy="75" rx="4" ry="5" fill="#fff" />
              <ellipse cx="135" cy="75" rx="4" ry="5" fill="#fff" />
              
              {/* Eyebrows */}
              <path
                d="M 55 65 Q 70 55 85 65"
                stroke="#8b4513"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 115 65 Q 130 55 145 65"
                stroke="#8b4513"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Nose */}
              <path
                d="M 100 90 L 95 110 L 100 115 L 105 110 Z"
                fill="#d4a574"
                stroke="#c09660"
                strokeWidth="1"
              />
              
              {/* Mouth - changes based on talking state */}
              {isTalking ? (
                // Talking mouth (open)
                <g>
                  <ellipse
                    cx="100"
                    cy="140"
                    rx="20"
                    ry="15"
                    fill="#8b1538"
                    stroke="#d4888a"
                    strokeWidth="2"
                  />
                  {/* Teeth */}
                  <rect x="85" y="130" width="30" height="8" fill="#f8f8f8" rx="4" />
                  {/* Tongue */}
                  <ellipse cx="100" cy="145" rx="15" ry="8" fill="#ff9999" />
                </g>
              ) : (
                // Default mouth (closed/slight smile)
                <path
                  d="M 80 140 Q 100 155 120 140"
                  stroke="#d4888a"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              
              {/* Cheeks (slight blush) */}
              <circle cx="50" cy="120" r="15" fill="#ffb3ba" opacity="0.3" />
              <circle cx="150" cy="120" r="15" fill="#ffb3ba" opacity="0.3" />
              
              {/* Interactive indicator when talking */}
              {isTalking && (
                <g>
                  {/* Speech bubbles */}
                  <circle cx="160" cy="60" r="3" fill="#87ceeb" opacity="0.7">
                    <animate attributeName="r" values="3;8;3" dur="0.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="170" cy="50" r="2" fill="#87ceeb" opacity="0.5">
                    <animate attributeName="r" values="2;6;2" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom instruction */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/80 text-white text-xs p-2 rounded-lg backdrop-blur-sm">
        <div className="text-center">
          {isTalking ? (
            <div className="font-semibold">🗣️ Speaking...</div>
          ) : (
            <div>Click syllables to see mouth movement</div>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-3 right-3 flex gap-1">
        <div className="bg-green-500/90 text-white px-2 py-1 rounded text-xs">
          Simple
        </div>
        <div className="bg-purple-500/90 text-white px-2 py-1 rounded text-xs">
          Interactive
        </div>
      </div>
    </div>
  );
};
