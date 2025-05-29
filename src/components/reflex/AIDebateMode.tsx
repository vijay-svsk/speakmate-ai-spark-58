
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Brain } from "lucide-react";
import { SessionData } from "@/pages/Reflex";

interface AIDebateModeProps {
  onSessionEnd: (data: SessionData) => void;
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  energy: number;
  setEnergy: (value: number) => void;
}

const debateTopics = [
  {
    topic: "Social media does more harm than good",
    aiPosition: "Social media connects people globally and democratizes information sharing.",
    counterPoints: ["addiction", "misinformation", "privacy", "mental health"]
  },
  {
    topic: "Remote work is better than office work",
    aiPosition: "Remote work increases productivity and work-life balance.",
    counterPoints: ["collaboration", "company culture", "supervision", "communication"]
  },
  {
    topic: "Electric cars are the future of transportation",
    aiPosition: "Electric vehicles are environmentally friendly and technologically advanced.",
    counterPoints: ["infrastructure", "cost", "range anxiety", "battery disposal"]
  },
  {
    topic: "Artificial intelligence will replace human jobs",
    aiPosition: "AI enhances human capabilities and creates new opportunities.",
    counterPoints: ["unemployment", "creativity", "human touch", "decision making"]
  }
];

export const AIDebateMode: React.FC<AIDebateModeProps> = ({
  onSessionEnd,
  transcript,
  isListening,
  startListening,
  stopListening,
  resetTranscript,
  energy,
  setEnergy
}) => {
  const [currentTopic, setCurrentTopic] = useState(debateTopics[0]);
  const [phase, setPhase] = useState<"reading" | "thinking" | "speaking" | "feedback">("reading");
  const [timeLeft, setTimeLeft] = useState(10);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startNewRound = () => {
    const randomTopic = debateTopics[Math.floor(Math.random() * debateTopics.length)];
    setCurrentTopic(randomTopic);
    setPhase("reading");
    setTimeLeft(10);
    setRoundStartTime(Date.now());
    resetTranscript();

    // Reading phase (10 seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase("thinking");
          setTimeLeft(5);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    // Transition to thinking phase after 10 seconds
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPhase("speaking");
            setTimeLeft(15);
            startListening();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);

      // Transition to speaking phase after 5 seconds
      setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleTimeUp();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 5000);
    }, 10000);
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
    
    // Evaluate debate performance
    let accuracy = hasResponse ? 60 : 0;
    let fluency = Math.max(0, 100 - (responseTime / 200));
    let confidence = hasResponse ? 70 : 0;

    // Check for counter-arguments and keywords
    const lowerTranscript = transcript.toLowerCase();
    const usedCounterPoints = currentTopic.counterPoints.filter(point => 
      lowerTranscript.includes(point.toLowerCase())
    );

    // Bonus for using relevant counter-arguments
    if (usedCounterPoints.length > 0) {
      accuracy += usedCounterPoints.length * 15;
      confidence += 10;
    }

    // Check for debate words
    const debateWords = ["however", "although", "but", "despite", "nevertheless", "on the contrary", "in contrast"];
    const usedDebateWords = debateWords.filter(word => lowerTranscript.includes(word));
    
    if (usedDebateWords.length > 0) {
      fluency += usedDebateWords.length * 10;
    }

    const roundScore = Math.round((accuracy + fluency + confidence) / 3);
    
    if (hasResponse) {
      setScore(prev => prev + roundScore);
    } else {
      setEnergy(Math.max(0, energy - 25));
    }

    const responseData = {
      prompt: `Debate: ${currentTopic.topic}`,
      response: transcript,
      responseTime: responseTime / 1000,
      accuracy: Math.min(100, accuracy),
      fluency: Math.min(100, fluency),
      confidence: Math.min(100, confidence)
    };

    setResponses(prev => [...prev, responseData]);
    setPhase("feedback");

    // End session after 5 rounds or if energy is depleted
    if (round >= 5 || energy <= 0) {
      setTimeout(() => {
        onSessionEnd({
          mode: "ai-debate",
          responses: [...responses, responseData],
          totalTime: (Date.now() - sessionStartTime) / 1000,
          streak: responses.filter(r => r.response.length > 0).length,
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
      case "reading":
        return "📖 Read the AI's position carefully";
      case "thinking":
        return "🤔 Think of your counter-arguments";
      case "speaking":
        return "🗣️ Present your opposing view now!";
      case "feedback":
        return "📊 Evaluating your argument...";
      default:
        return "";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "reading": return "text-blue-500";
      case "thinking": return "text-yellow-500";
      case "speaking": return "text-green-500";
      case "feedback": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Debate Challenge 🤖</h1>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span>Round {round}/5</span>
          <span>Score: {score}</span>
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
      <Card className="w-full max-w-3xl">
        <CardContent className="p-8">
          
          {/* Phase Indicator */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">{timeLeft}</div>
            <p className={`text-lg font-medium ${getPhaseColor()}`}>
              {getPhaseInstruction()}
            </p>
          </div>

          {/* Topic */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">Debate Topic:</h2>
            <p className="text-2xl font-bold text-center text-primary">
              "{currentTopic.topic}"
            </p>
          </div>

          {/* AI Position */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-blue-500" />
              <h3 className="font-bold">AI's Position:</h3>
            </div>
            <p className="text-lg">{currentTopic.aiPosition}</p>
          </div>

          {/* Counter-argument hints */}
          {(phase === "thinking" || phase === "speaking") && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
              <h3 className="font-bold mb-2">💡 Consider these angles:</h3>
              <div className="flex flex-wrap gap-2">
                {currentTopic.counterPoints.map((point, index) => (
                  <span 
                    key={index}
                    className="bg-yellow-200 dark:bg-yellow-800 px-3 py-1 rounded-full text-sm"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Your Response */}
          {phase === "speaking" && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6 min-h-[100px]">
              <h3 className="text-sm font-medium mb-2">Your Counter-Argument:</h3>
              <p className="text-lg">{transcript || "Start speaking your opposing view..."}</p>
            </div>
          )}

          {/* Feedback */}
          {phase === "feedback" && (
            <div className="text-center">
              <div className="text-4xl mb-4">
                {transcript ? "⚖️" : "😔"}
              </div>
              <h3 className="text-xl font-bold mb-4">
                {transcript ? "Argument Recorded!" : "No Response Detected"}
              </h3>
              {transcript ? (
                <p className="text-green-600 dark:text-green-400">
                  Your counter-argument was noted. Points awarded based on clarity and reasoning!
                </p>
              ) : (
                <p className="text-red-600 dark:text-red-400">
                  Remember to present your opposing viewpoint within the time limit.
                </p>
              )}
            </div>
          )}

          {/* Mic Button (only during speaking phase) */}
          {phase === "speaking" && (
            <div className="text-center">
              <Button
                size="lg"
                className={`w-20 h-20 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
                disabled
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Microphone is automatically active during speaking phase
              </p>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center mt-6 max-w-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Present a clear counter-argument to the AI's position. Use logical reasoning, examples, and opposing viewpoints to strengthen your debate skills.
        </p>
      </div>

    </div>
  );
};
