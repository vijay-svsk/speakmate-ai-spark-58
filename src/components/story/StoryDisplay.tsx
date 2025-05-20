
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Play, RefreshCcw } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

interface StoryDisplayProps {
  story: string;
  onProgressUpdate: (progress: number) => void;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, onProgressUpdate }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatus, setWordStatus] = useState<('pending' | 'correct' | 'incorrect')[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, startListening, stopListening, supported } = useSpeechRecognition();
  
  // Process the story into words when it changes
  useEffect(() => {
    if (story) {
      const storyWords = story
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.toLowerCase().replace(/[^\w']/g, ''));
      
      setWords(storyWords);
      setWordStatus(new Array(storyWords.length).fill('pending'));
      setCurrentWordIndex(0);
      onProgressUpdate(0);
    }
  }, [story, onProgressUpdate]);

  // Check word when transcript changes
  useEffect(() => {
    if (!isListening || !transcript || currentWordIndex >= words.length) return;

    const spokenWord = transcript.toLowerCase().trim();
    const expectedWord = words[currentWordIndex].toLowerCase();
    
    if (spokenWord === expectedWord) {
      // Word is correct
      const newWordStatus = [...wordStatus];
      newWordStatus[currentWordIndex] = 'correct';
      setWordStatus(newWordStatus);
      
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      }
      
      // Update progress
      const progress = ((currentWordIndex + 1) / words.length) * 100;
      onProgressUpdate(progress);
      
      // Reset transcript for next word
      resetTranscript();
    } else if (spokenWord && spokenWord !== expectedWord && !spokenWord.startsWith(expectedWord.substring(0, 2))) {
      // Word is incorrect (and not just the beginning of the expected word)
      const newWordStatus = [...wordStatus];
      newWordStatus[currentWordIndex] = 'incorrect';
      setWordStatus(newWordStatus);
    }
  }, [transcript, isListening, currentWordIndex, words, wordStatus, onProgressUpdate, resetTranscript]);

  const handleStartReading = () => {
    if (!supported) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }
    
    setIsListening(true);
    resetTranscript();
    startListening();
  };

  const handleStopReading = () => {
    setIsListening(false);
    stopListening();
  };

  const handleResetProgress = () => {
    setCurrentWordIndex(0);
    setWordStatus(new Array(words.length).fill('pending'));
    onProgressUpdate(0);
    resetTranscript();
  };

  const handleSpeakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!story || words.length === 0) {
    return <div className="text-center py-8">No story available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-lg">
        {words.map((word, index) => (
          <span 
            key={index}
            className={cn(
              "px-1 py-0.5 mx-0.5 rounded-sm cursor-pointer transition-colors",
              index === currentWordIndex && "bg-yellow-100 border border-yellow-300",
              wordStatus[index] === 'correct' && "text-green-600 font-medium",
              wordStatus[index] === 'incorrect' && "text-red-600 font-medium",
            )}
            onClick={() => handleSpeakWord(word)}
          >
            {word}
            {/[.!?;]$/.test(story.split(/\s+/)[index] || '') && ' '}
          </span>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <p className="text-sm mb-4">
          {isListening 
            ? "Speak the highlighted word..."
            : "Click the start button to begin reading the story out loud."}
        </p>
        
        {transcript && (
          <div className="mb-4">
            <span className="font-medium">You said: </span>
            <span className="text-muted-foreground">{transcript}</span>
          </div>
        )}
        
        <div className="flex space-x-3">
          {!isListening ? (
            <Button onClick={handleStartReading}>
              <Mic className="mr-2 h-4 w-4" />
              Start Reading
            </Button>
          ) : (
            <Button onClick={handleStopReading} variant="secondary">
              Stop Reading
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => handleSpeakWord(words[currentWordIndex])}
          >
            <Play className="mr-2 h-4 w-4" />
            Hear Word
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={handleResetProgress}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Progress
          </Button>
        </div>
      </div>
    </div>
  );
};
