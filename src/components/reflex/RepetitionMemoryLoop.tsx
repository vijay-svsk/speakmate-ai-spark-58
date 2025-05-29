
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react";
import { SessionData } from "@/pages/Reflex";

interface RepetitionMemoryLoopProps {
  onSessionEnd: (data: SessionData) => void;
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  energy: number;
  setEnergy: (value: number) => void;
}

const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "She sells seashells by the seashore every summer",
  "A journey of a thousand miles begins with a single step",
  "The early bird catches the worm but the second mouse gets the cheese",
  "In the midst of winter I found there was within me an invincible summer",
  "Technology is best when it brings people together and makes life easier",
  "Success is not final failure is not fatal it is the courage to continue that counts"
];

export const RepetitionMemoryLoop: React.FC<RepetitionMemoryLoopProps> = ({
  onSessionEnd,
  transcript,
  isListening,
  startListening,
  stopListening,
  resetTranscript,
  energy,
  setEnergy
}) => {
  const [currentSentence, setCurrentSentence] = useState("");
  const [phase, setPhase] = useState<"ready" | "listening" | "recording" | "feedback">("ready");
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [accuracy, setAccuracy] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startNewRound = () => {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setCurrentSentence(randomSentence);
    setPhase("ready");
    setAccuracy(0);
    setRoundStartTime(Date.now());
    resetTranscript();
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setPhase("listening");
      utterance.onend = () => {
        setPhase("recording");
        setTimeLeft(10);
        startListening();
        
        // Start recording timer
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
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    stopListening();
    evaluateResponse();
  };

  const calculateAccuracy = (original: string, spoken: string): number => {
    const originalWords = original.toLowerCase().split(' ');
    const spokenWords = spoken.toLowerCase().split(' ');
    
    let matches = 0;
    const maxLength = Math.max(originalWords.length, spokenWords.length);
    
    for (let i = 0; i < Math.min(originalWords.length, spokenWords.length); i++) {
      if (originalWords[i] === spokenWords[i]) {
        matches++;
      }
    }
    
    return maxLength > 0 ? (matches / originalWords.length) * 100 : 0;
  };

  const evaluateResponse = () => {
    const responseTime = Date.now() - roundStartTime;
    const hasResponse = transcript.trim().length > 0;
    
    // Calculate accuracy based on word matching
    const accuracyScore = hasResponse ? calculateAccuracy(currentSentence, transcript) : 0;
    setAccuracy(accuracyScore);
    
    let fluency = Math.max(0, 100 - (responseTime / 200));
    let confidence = hasResponse ? Math.min(100, 60 + (accuracyScore * 0.4)) : 0;

    const roundScore = Math.round((accuracyScore + fluency + confidence) / 3);
    
    if (hasResponse) {
      setScore(prev => prev + roundScore);
    } else {
      setEnergy(Math.max(0, energy - 25));
    }

    const responseData = {
      prompt: `Repeat: "${currentSentence}"`,
      response: transcript,
      responseTime: responseTime / 1000,
      accuracy: accuracyScore,
      fluency,
      confidence
    };

    setResponses(prev => [...prev, responseData]);
    setPhase("feedback");

    // End session after 7 rounds or if energy is depleted
    if (round >= 7 || energy <= 0) {
      setTimeout(() => {
        onSessionEnd({
          mode: "repetition-memory",
          responses: [...responses, responseData],
          totalTime: (Date.now() - sessionStartTime) / 1000,
          streak: responses.filter(r => r.accuracy >= 70).length,
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

  const getPhaseInstruction = () => {
    switch (phase) {
      case "ready":
        return "🎧 Click play to hear the sentence";
      case "listening":
        return "👂 Listen carefully...";
      case "recording":
        return "🗣️ Repeat exactly what you heard";
      case "feedback":
        return "📊 Checking your accuracy...";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Memory Loop Challenge 🔁</h1>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span>Round {round}/7</span>
          <span>Score: {score}</span>
          {accuracy > 0 && <span>Accuracy: {accuracy.toFixed(1)}%</span>}
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
          
          {/* Phase Indicator */}
          <div className="text-center mb-6">
            {phase === "recording" && (
              <div className="text-6xl font-bold mb-2 text-primary">{timeLeft}</div>
            )}
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {getPhaseInstruction()}
            </p>
          </div>

          {/* Sentence Display */}
          {phase === "ready" && (
            <div className="bg-primary/10 rounded-lg p-6 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                You will hear a sentence. Listen carefully and repeat it exactly.
              </p>
              <Button 
                size="lg"
                onClick={playAudio}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Play Sentence
              </Button>
            </div>
          )}

          {/* Listening Phase */}
          {phase === "listening" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👂</div>
              <p className="text-xl font-medium">Listening to sentence...</p>
              <div className="mt-4">
                <div className="animate-pulse flex justify-center space-x-2">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          {/* Recording Phase */}
          {phase === "recording" && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 min-h-[100px]">
                <h3 className="text-sm font-medium mb-2">Your Repetition:</h3>
                <p className="text-lg">{transcript || "Start repeating the sentence you heard..."}</p>
              </div>
              
              <div className="text-center">
                <Button
                  size="lg"
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 animate-pulse"
                  disabled
                >
                  <Mic className="h-8 w-8" />
                </Button>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Recording automatically started
                </p>
              </div>
            </div>
          )}

          {/* Feedback Phase */}
          {phase === "feedback" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {accuracy >= 90 ? "🎯" : accuracy >= 70 ? "👍" : accuracy >= 50 ? "📝" : "🔄"}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {accuracy >= 90 ? "Perfect Repetition!" : accuracy >= 70 ? "Great Job!" : accuracy >= 50 ? "Good Effort!" : "Keep Practicing!"}
                </h3>
                <p className="text-lg text-primary font-semibold">
                  Accuracy: {accuracy.toFixed(1)}%
                </p>
              </div>

              {/* Comparison */}
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Original:</h4>
                  <p className="text-lg">"{currentSentence}"</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Your Response:</h4>
                  <p className="text-lg">"{transcript}"</p>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center mt-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Listen to each sentence carefully and repeat it as accurately as possible. This exercise trains your memory and pronunciation simultaneously.
        </p>
      </div>

    </div>
  );
};
