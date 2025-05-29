import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, RotateCcw, Play } from "lucide-react";
import { SessionData } from "@/pages/Reflex";

interface EmotionShiftChallengeProps {
  onSessionEnd: (data: SessionData) => void;
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  energy: number;
  setEnergy: (value: number) => void;
}

const emotions = [
  { name: "Happy", emoji: "😊", color: "text-yellow-500" },
  { name: "Sad", emoji: "😢", color: "text-blue-500" },
  { name: "Angry", emoji: "😠", color: "text-red-500" },
  { name: "Excited", emoji: "🤩", color: "text-orange-500" },
  { name: "Confused", emoji: "😕", color: "text-purple-500" },
  { name: "Sarcastic", emoji: "😏", color: "text-green-500" },
  { name: "Nervous", emoji: "😰", color: "text-pink-500" },
  { name: "Confident", emoji: "😎", color: "text-indigo-500" }
];

const sentences = [
  "I really love this weather today",
  "The meeting went exactly as planned",
  "This food tastes absolutely amazing",
  "I'm so prepared for this presentation",
  "Traffic was really smooth this morning",
  "The movie was quite entertaining",
  "My phone battery lasts all day",
  "This homework is really easy"
];

export const EmotionShiftChallenge: React.FC<EmotionShiftChallengeProps> = ({
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
  const [currentEmotion, setCurrentEmotion] = useState(emotions[0]);
  const [timeLeft, setTimeLeft] = useState(8);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [roundTranscript, setRoundTranscript] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Track transcript for this specific round
  useEffect(() => {
    if (transcript && !showFeedback) {
      setRoundTranscript(transcript);
    }
  }, [transcript, showFeedback]);

  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startNewRound = () => {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    setCurrentSentence(randomSentence);
    setCurrentEmotion(randomEmotion);
    setTimeLeft(8);
    setShowFeedback(false);
    setRoundStartTime(Date.now());
    setRoundTranscript("");
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
    // Use the accumulated transcript for this round
    const finalTranscript = roundTranscript || transcript;
    const hasResponse = finalTranscript.trim().length > 0;
    
    // Simple scoring based on response presence and emotion keywords
    let accuracy = hasResponse ? 70 : 0;
    let fluency = Math.max(0, 100 - (responseTime / 100));
    let confidence = hasResponse ? 80 : 0;
    
    // Bonus points for emotion-related words
    const emotionWords = {
      "Happy": ["great", "wonderful", "amazing", "fantastic"],
      "Sad": ["terrible", "awful", "disappointing", "horrible"],
      "Angry": ["ridiculous", "outrageous", "unacceptable", "terrible"],
      "Excited": ["incredible", "awesome", "fantastic", "amazing"],
      "Confused": ["weird", "strange", "odd", "confusing"],
      "Sarcastic": ["sure", "right", "obviously", "definitely"],
      "Nervous": ["maybe", "perhaps", "might", "possibly"],
      "Confident": ["definitely", "absolutely", "certainly", "obviously"]
    };

    const emotionKeywords = emotionWords[currentEmotion.name as keyof typeof emotionWords] || [];
    const hasEmotionWords = emotionKeywords.some(word => 
      finalTranscript.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasEmotionWords) {
      accuracy += 20;
      confidence += 10;
    }

    const roundScore = Math.round((accuracy + fluency + confidence) / 3);
    
    if (hasResponse) {
      setScore(prev => prev + roundScore);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
      setEnergy(prev => Math.max(0, prev - 20));
    }

    const responseData = {
      prompt: `Say "${currentSentence}" with ${currentEmotion.name} emotion`,
      response: finalTranscript,
      responseTime: responseTime / 1000,
      accuracy,
      fluency,
      confidence
    };

    setResponses(prev => [...prev, responseData]);
    setShowFeedback(true);

    // End session after 8 rounds or if energy is depleted
    if (round >= 8 || energy <= 0) {
      setTimeout(() => {
        onSessionEnd({
          mode: "emotion-shift",
          responses: [...responses, responseData],
          totalTime: (Date.now() - sessionStartTime) / 1000,
          streak,
          score: score + roundScore
        });
      }, 2000);
    } else {
      setTimeout(() => {
        setRound(prev => prev + 1);
        startNewRound();
      }, 3000);
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
        <h1 className="text-3xl font-bold mb-2">Emotion Shift Challenge 🎭</h1>
        <div className="flex items-center justify-center gap-6 text-sm">
          <span>Round {round}/8</span>
          <span>Score: {score}</span>
          <span>Streak: {streak}</span>
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
        <CardContent className="p-8 text-center">
          
          {!showFeedback ? (
            <>
              {/* Timer */}
              <div className="text-6xl font-bold mb-6 text-primary">
                {timeLeft}
              </div>

              {/* Current Emotion */}
              <div className="mb-6">
                <div className="text-6xl mb-2">{currentEmotion.emoji}</div>
                <h2 className={`text-2xl font-bold ${currentEmotion.color}`}>
                  {currentEmotion.name}
                </h2>
              </div>

              {/* Sentence to say */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <p className="text-xl font-medium mb-2">Say this sentence with {currentEmotion.name} emotion:</p>
                <p className="text-2xl font-bold text-primary">
                  "{currentSentence}"
                </p>
              </div>

              {/* Your Response */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 min-h-[80px]">
                <h3 className="text-sm font-medium mb-2">Your Response (Continuous):</h3>
                <p className="text-lg">{roundTranscript || transcript || "Start speaking..."}</p>
                {(roundTranscript || transcript) && (
                  <div className="text-xs text-gray-500 mt-1">
                    Words: {(roundTranscript || transcript).trim().split(/\s+/).length}
                  </div>
                )}
              </div>

              {/* Mic Button */}
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
              
              {isListening && (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                  Speaking continuously... pauses won't reset your response
                </p>
              )}
            </>
          ) : (
            <>
              {/* Feedback */}
              <div className="text-center">
                <div className="text-4xl mb-4">
                  {roundTranscript || transcript ? "🎉" : "😔"}
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {roundTranscript || transcript ? "Great job!" : "Time's up!"}
                </h3>
                {roundTranscript || transcript ? (
                  <p className="text-green-600 dark:text-green-400">
                    You expressed the emotion well! +{Math.round(score/round)} points
                  </p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    No response detected. Try to speak louder and clearer.
                  </p>
                )}
                
                {round < 8 && energy > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Next round starting in 3 seconds...
                  </p>
                )}
              </div>
            </>
          )}

        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="text-center mt-6 max-w-md">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Express the sentence using the emotional tone shown. Your voice, pace, and word choice should match the emotion! Speech continues during pauses.
        </p>
      </div>

    </div>
  );
};
