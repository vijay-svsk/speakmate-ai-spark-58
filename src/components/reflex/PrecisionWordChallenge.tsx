
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Target, Check, X } from "lucide-react";
import { SessionData } from "@/pages/Reflex";

interface PrecisionWordChallengeProps {
  onSessionEnd: (data: SessionData) => void;
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  energy: number;
  setEnergy: (value: number) => void;
}

const targetWordSets = [
  {
    prompt: "Describe your perfect vacation",
    words: ["nevertheless", "magnificent", "furthermore"],
    difficulty: "Advanced"
  },
  {
    prompt: "Talk about technology in education",
    words: ["enhance", "innovative", "significant"],
    difficulty: "Intermediate"
  },
  {
    prompt: "Discuss healthy eating habits",
    words: ["essential", "nutritious", "beneficial"],
    difficulty: "Intermediate"
  },
  {
    prompt: "Explain your career goals",
    words: ["ambitious", "accomplish", "expertise"],
    difficulty: "Advanced"
  },
  {
    prompt: "Describe a memorable experience",
    words: ["incredible", "overwhelming", "unforgettable"],
    difficulty: "Beginner"
  }
];

export const PrecisionWordChallenge: React.FC<PrecisionWordChallengeProps> = ({
  onSessionEnd,
  transcript,
  isListening,
  startListening,
  stopListening,
  resetTranscript,
  energy,
  setEnergy
}) => {
  const [currentChallenge, setCurrentChallenge] = useState(targetWordSets[0]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Check for target words in real-time
    const lowerTranscript = transcript.toLowerCase();
    const newUsedWords = currentChallenge.words.filter(word => 
      lowerTranscript.includes(word.toLowerCase()) && !usedWords.includes(word)
    );
    
    if (newUsedWords.length > 0) {
      setUsedWords(prev => [...prev, ...newUsedWords]);
    }
  }, [transcript, currentChallenge.words, usedWords]);

  const startNewRound = () => {
    const randomChallenge = targetWordSets[Math.floor(Math.random() * targetWordSets.length)];
    setCurrentChallenge(randomChallenge);
    setTimeLeft(15);
    setUsedWords([]);
    setShowFeedback(false);
    setRoundStartTime(Date.now());
    resetTranscript();

    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    stopListening();
    evaluateResponse();
  };

  const evaluateResponse = () => {
    const responseTime = Date.now() - roundStartTime;
    const hasResponse = transcript.trim().length > 0;
    const wordsUsed = usedWords.length;
    const totalWords = currentChallenge.words.length;
    
    // Calculate scores
    let accuracy = (wordsUsed / totalWords) * 100;
    let fluency = Math.max(0, 100 - (responseTime / 200));
    let confidence = hasResponse ? Math.min(100, 60 + (wordsUsed * 20)) : 0;

    // Bonus for using all words
    if (wordsUsed === totalWords) {
      accuracy = 100;
      confidence += 20;
    }

    const roundScore = Math.round((accuracy + fluency + confidence) / 3);
    
    if (hasResponse) {
      setScore(prev => prev + roundScore);
    } else {
      setEnergy(Math.max(0, energy - 20));
    }

    const responseData = {
      prompt: `${currentChallenge.prompt} (Include: ${currentChallenge.words.join(", ")})`,
      response: transcript,
      responseTime: responseTime / 1000,
      accuracy,
      fluency,
      confidence
    };

    setResponses(prev => [...prev, responseData]);
    setShowFeedback(true);

    // End session after 6 rounds or if energy is depleted
    if (round >= 6 || energy <= 0) {
      setTimeout(() => {
        onSessionEnd({
          mode: "precision-word",
          responses: [...responses, responseData],
          totalTime: (Date.now() - sessionStartTime) / 1000,
          streak: responses.filter(r => r.accuracy >= 50).length,
          score: score + roundScore
        });
      }, 3000);
    } else {
      setTimeout(() => {
        setRound(prev => prev + 1);
        startNewRound();
      }, 4000);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Precision Word Challenge 🎯</h1>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span>Round {round}/6</span>
          <span>Score: {score}</span>
          <span className={`font-bold ${currentChallenge.difficulty === 'Advanced' ? 'text-red-500' : currentChallenge.difficulty === 'Intermediate' ? 'text-orange-500' : 'text-green-500'}`}>
            {currentChallenge.difficulty}
          </span>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Energy</span>
          <span className="text-sm">{energy}%</span>
        </div>
        <Progress value={energy} className="h-3" />
      </div>

      {/* Main Challenge Card */}
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          
          {!showFeedback ? (
            <>
              {/* Timer */}
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2 text-primary">{timeLeft}</div>
                <p className="text-lg">Use ALL target words in your response!</p>
              </div>

              {/* Prompt */}
              <div className="bg-primary/10 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Your Challenge:</h2>
                <p className="text-lg">{currentChallenge.prompt}</p>
              </div>

              {/* Target Words */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold">Target Words to Include:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentChallenge.words.map((word, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        usedWords.includes(word)
                          ? 'bg-green-200 dark:bg-green-800 border-green-500 text-green-800 dark:text-green-200'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{word}</span>
                        {usedWords.includes(word) ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Target className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Response */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 min-h-[100px]">
                <h3 className="text-sm font-medium mb-2">Your Response:</h3>
                <p className="text-lg">{transcript || "Start speaking and include the target words..."}</p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Words Used</span>
                  <span className="text-sm">{usedWords.length}/{currentChallenge.words.length}</span>
                </div>
                <Progress value={(usedWords.length / currentChallenge.words.length) * 100} className="h-3" />
              </div>

              {/* Mic Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleMicToggle}
                  className={`w-20 h-20 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Feedback */}
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {usedWords.length === currentChallenge.words.length ? "🎯" : usedWords.length > 0 ? "👍" : "😔"}
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {usedWords.length === currentChallenge.words.length 
                    ? "Perfect Shot!" 
                    : usedWords.length > 0 
                      ? "Good Progress!" 
                      : "Missed the Target"}
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-lg mb-2">Words Successfully Used:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentChallenge.words.map((word, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          usedWords.includes(word)
                            ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}
                      >
                        {word} {usedWords.includes(word) ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {usedWords.length}/{currentChallenge.words.length} target words included
                </p>
              </div>
            </>
          )}

        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center mt-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Respond naturally to the prompt while incorporating ALL the target words. This builds advanced vocabulary integration skills!
        </p>
      </div>

    </div>
  );
};
