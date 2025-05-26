
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Play, RefreshCcw, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

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
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakFullStory = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!story || words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-muted-foreground">
          No story available yet. Click "New Story" to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Story Text Display */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="text-xl leading-relaxed font-serif">
          {words.map((word, index) => (
            <span 
              key={index}
              className={cn(
                "px-2 py-1 mx-1 rounded-md cursor-pointer transition-all duration-300 inline-block",
                index === currentWordIndex && "bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 shadow-lg scale-110",
                wordStatus[index] === 'correct' && "text-green-700 dark:text-green-300 font-semibold bg-green-100 dark:bg-green-900/30",
                wordStatus[index] === 'incorrect' && "text-red-700 dark:text-red-300 font-semibold bg-red-100 dark:bg-red-900/30",
                wordStatus[index] === 'pending' && index !== currentWordIndex && "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => handleSpeakWord(word)}
              title={`Click to hear "${word}"`}
            >
              {word}
              {/[.!?;]$/.test(story.split(/\s+/)[index] || '') && ' '}
            </span>
          ))}
        </div>
      </div>

      {/* Reading Controls */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          {/* Status Display */}
          <div className="mb-6 text-center">
            <p className="text-lg mb-2">
              {isListening 
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Listening... Say the highlighted word</span>
                  </span>
                )
                : "Click 'Start Reading' to begin practicing pronunciation"
              }
            </p>
            
            {transcript && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <span className="font-medium text-primary">You said: </span>
                <span className="text-lg font-mono">{transcript}</span>
              </div>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {!isListening ? (
              <Button 
                onClick={handleStartReading} 
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Reading Practice
              </Button>
            ) : (
              <Button 
                onClick={handleStopReading} 
                variant="secondary" 
                size="lg"
                className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
              >
                <Mic className="mr-2 h-5 w-5" />
                Stop Reading
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => handleSpeakWord(words[currentWordIndex])}
              size="lg"
              className="border-blue-300 hover:bg-blue-50"
            >
              <Play className="mr-2 h-5 w-5" />
              Hear Current Word
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSpeakFullStory}
              size="lg"
              className="border-purple-300 hover:bg-purple-50"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Listen to Story
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleResetProgress}
              size="lg"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Reset Progress
            </Button>
          </div>

          {/* Reading Tips */}
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Reading Tips:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Click on any word to hear its pronunciation</li>
              <li>• Speak clearly and at a normal pace</li>
              <li>• The highlighted word shows your current position</li>
              <li>• Green words are correctly pronounced, red ones need practice</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
