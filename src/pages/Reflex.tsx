
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RotateCcw, Trophy, Zap, Target, Brain, Mic, MicOff, Timer, Star } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { EmotionShiftChallenge } from "@/components/reflex/EmotionShiftChallenge";
import { AIDebateMode } from "@/components/reflex/AIDebateMode";
import { PrecisionWordChallenge } from "@/components/reflex/PrecisionWordChallenge";
import { RepetitionMemoryLoop } from "@/components/reflex/RepetitionMemoryLoop";
import { ShadowMode } from "@/components/reflex/ShadowMode";
import { VisualPromptResponse } from "@/components/reflex/VisualPromptResponse";
import { SpeakingAnalytics } from "@/components/reflex/SpeakingAnalytics";
import { PressureMode } from "@/components/reflex/PressureMode";

export type ChallengeMode = 
  | "emotion-shift" 
  | "ai-debate" 
  | "precision-word" 
  | "repetition-memory" 
  | "shadow-mode" 
  | "visual-prompt" 
  | "pressure-mode";

export interface SessionData {
  mode: ChallengeMode;
  responses: Array<{
    prompt: string;
    response: string;
    responseTime: number;
    accuracy: number;
    fluency: number;
    confidence: number;
  }>;
  totalTime: number;
  streak: number;
  score: number;
}

const ReflexChallenge: React.FC = () => {
  const { toast } = useToast();
  const [currentMode, setCurrentMode] = useState<ChallengeMode>("emotion-shift");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(() => {
    const saved = localStorage.getItem('reflex-daily-streak');
    return saved ? parseInt(saved) : 0;
  });
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem('reflex-total-score');
    return saved ? parseInt(saved) : 0;
  });

  const {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    supported
  } = useSpeechRecognition();

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('reflex-daily-streak', dailyStreak.toString());
    localStorage.setItem('reflex-total-score', totalScore.toString());
  }, [dailyStreak, totalScore]);

  const startSession = useCallback((mode: ChallengeMode) => {
    setCurrentMode(mode);
    setIsSessionActive(true);
    setShowAnalytics(false);
    setEnergy(100);
    setSessionData({
      mode,
      responses: [],
      totalTime: 0,
      streak: 0,
      score: 0
    });
    resetTranscript();
    
    toast({
      title: "Session Started! 🚀",
      description: `${getModeTitle(mode)} mode activated. Get ready!`,
    });
  }, [resetTranscript, toast]);

  const endSession = useCallback((data: SessionData) => {
    setIsSessionActive(false);
    setSessionData(data);
    setShowAnalytics(true);
    setCurrentStreak(data.streak);
    setTotalScore(prev => prev + data.score);
    
    // Update daily streak
    if (data.responses.length > 0) {
      setDailyStreak(prev => prev + 1);
    }
    
    stopListening();
    
    toast({
      title: "Session Complete! 🎉",
      description: `Score: ${data.score} points, Streak: ${data.streak}`,
    });
  }, [stopListening, toast]);

  const getModeTitle = (mode: ChallengeMode): string => {
    const titles = {
      "emotion-shift": "Emotion Shift",
      "ai-debate": "AI Debate",
      "precision-word": "Precision Word",
      "repetition-memory": "Memory Loop",
      "shadow-mode": "Shadow Mode",
      "visual-prompt": "Visual Response",
      "pressure-mode": "Pressure Mode"
    };
    return titles[mode];
  };

  const getModeDescription = (mode: ChallengeMode): string => {
    const descriptions = {
      "emotion-shift": "Express the same sentence with different emotions",
      "ai-debate": "Argue against AI-generated counterpoints",
      "precision-word": "Include specific target words in responses",
      "repetition-memory": "Listen and repeat sentences exactly",
      "shadow-mode": "Mirror native speaker pronunciation",
      "visual-prompt": "Describe images and videos in real-time",
      "pressure-mode": "Sudden-death and time attack challenges"
    };
    return descriptions[mode];
  };

  if (showAnalytics && sessionData) {
    return (
      <AppLayout>
        <SpeakingAnalytics 
          sessionData={sessionData}
          onNewSession={() => setShowAnalytics(false)}
        />
      </AppLayout>
    );
  }

  if (isSessionActive) {
    const ModeComponent = {
      "emotion-shift": EmotionShiftChallenge,
      "ai-debate": AIDebateMode,
      "precision-word": PrecisionWordChallenge,
      "repetition-memory": RepetitionMemoryLoop,
      "shadow-mode": ShadowMode,
      "visual-prompt": VisualPromptResponse,
      "pressure-mode": PressureMode
    }[currentMode];

    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
          <ModeComponent
            onSessionEnd={endSession}
            transcript={transcript}
            isListening={isListening}
            startListening={startListening}
            stopListening={stopListening}
            resetTranscript={resetTranscript}
            energy={energy}
            setEnergy={setEnergy}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Stats */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Reflex Challenge 2.0
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Your Personal Language Gym - Build Speaking Skills Under Pressure
            </p>
            
            {/* Stats Bar */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{totalScore.toLocaleString()}</span>
                <span className="text-sm text-gray-600">Total Score</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="font-semibold">{dailyStreak}</span>
                <span className="text-sm text-gray-600">Daily Streak</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span className="font-semibold">{currentStreak}</span>
                <span className="text-sm text-gray-600">Best Session</span>
              </div>
            </div>
          </div>

          {/* Mode Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Emotion Shift */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  🎭
                </div>
                <h3 className="text-xl font-bold">Emotion Shift</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Express the same sentence with different emotions
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("emotion-shift")}
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>

            {/* AI Debate */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-xl font-bold">AI Debate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Argue against AI-generated counterpoints
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("ai-debate")}
                >
                  Start Debate
                </Button>
              </CardContent>
            </Card>

            {/* Precision Word */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-xl font-bold">Precision Word</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Include specific target words in responses
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("precision-word")}
                >
                  Start Target Practice
                </Button>
              </CardContent>
            </Card>

            {/* Memory Loop */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  🔁
                </div>
                <h3 className="text-xl font-bold">Memory Loop</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Listen and repeat sentences exactly
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("repetition-memory")}
                >
                  Start Memory Training
                </Button>
              </CardContent>
            </Card>

            {/* Shadow Mode */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  🗣️
                </div>
                <h3 className="text-xl font-bold">Shadow Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Mirror native speaker pronunciation
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("shadow-mode")}
                >
                  Start Shadowing
                </Button>
              </CardContent>
            </Card>

            {/* Visual Prompt */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl transform group-hover:scale-110 transition-transform">
                  💡
                </div>
                <h3 className="text-xl font-bold">Visual Response</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Describe images and videos in real-time
                </p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => startSession("visual-prompt")}
                >
                  Start Visual Challenge
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Pressure Mode - Special Section */}
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-300 dark:border-red-700 mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl animate-pulse">
                🔥
              </div>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Pressure Mode</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sudden-death and time attack challenges - Only for the brave!
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 py-3"
                onClick={() => startSession("pressure-mode")}
              >
                Enter Pressure Mode 🔥
              </Button>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <h3 className="text-xl font-bold text-center">Why Reflex Challenge 2.0?</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-4">
                  <Timer className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Real-Time Pressure</h4>
                  <p className="text-gray-600 dark:text-gray-300">Build spontaneous speaking skills under time constraints</p>
                </div>
                <div className="text-center p-4">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Cognitive Training</h4>
                  <p className="text-gray-600 dark:text-gray-300">Strengthen memory, focus, and quick thinking</p>
                </div>
                <div className="text-center p-4">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Precision Practice</h4>
                  <p className="text-gray-600 dark:text-gray-300">Target specific vocabulary and grammar patterns</p>
                </div>
                <div className="text-center p-4">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-1">Progress Tracking</h4>
                  <p className="text-gray-600 dark:text-gray-300">Detailed analytics and achievement system</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!supported && (
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-6">
              <CardContent className="text-center p-6">
                <Mic className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Speech Recognition Not Available
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  For the best experience, please use Chrome or Edge browser which support speech recognition features.
                </p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </AppLayout>
  );
};

export default ReflexChallenge;
