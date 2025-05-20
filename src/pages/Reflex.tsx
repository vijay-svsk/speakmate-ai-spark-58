
import React, { useState, useEffect, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Play, Award, Clock, Volume2 } from "lucide-react";

interface Challenge {
  word: string;
  translation: string;
  timeLimit: number;
  points: number;
}

interface WordPair {
  english: string;
  translation: string;
}

// Mock data for challenges
const challenges: Challenge[] = [
  { word: "Hello", translation: "Hola", timeLimit: 3, points: 10 },
  { word: "Friend", translation: "Amigo", timeLimit: 3, points: 10 },
  { word: "Morning", translation: "Mañana", timeLimit: 2.5, points: 15 },
  { word: "School", translation: "Escuela", timeLimit: 2.5, points: 15 },
  { word: "Beautiful", translation: "Hermoso", timeLimit: 2, points: 20 },
  { word: "Computer", translation: "Computadora", timeLimit: 2, points: 20 },
  { word: "Restaurant", translation: "Restaurante", timeLimit: 1.5, points: 25 },
  { word: "Knowledge", translation: "Conocimiento", timeLimit: 1.5, points: 25 },
];

// Basic word pairs for practice
const basicWordPairs: WordPair[] = [
  { english: "Cat", translation: "Gato" },
  { english: "Dog", translation: "Perro" },
  { english: "House", translation: "Casa" },
  { english: "Tree", translation: "Árbol" },
  { english: "Water", translation: "Agua" },
  { english: "Book", translation: "Libro" },
  { english: "Sun", translation: "Sol" },
  { english: "Moon", translation: "Luna" },
  { english: "Sky", translation: "Cielo" },
  { english: "Car", translation: "Coche" },
];

const ReflexChallenge: React.FC = () => {
  const { toast } = useToast();
  const [currentLevel, setCurrentLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameMode, setGameMode] = useState<"practice" | "challenge">("practice");
  const [practiceWord, setPracticeWord] = useState<WordPair | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [timerProgress, setTimerProgress] = useState(100);
  
  // Initialize or reset the game
  const startGame = useCallback(() => {
    if (gameMode === "challenge") {
      setIsPlaying(true);
      setScore(0);
      setStreak(0);
      setCountdown(3);
      
      // Start countdown and then first challenge
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            startNewChallenge();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Practice mode
      startPracticeWord();
    }
  }, [gameMode]);
  
  // Start a new challenge
  const startNewChallenge = useCallback(() => {
    // Select a random challenge based on difficulty level
    const levelChallenges = challenges.filter((c) => {
      if (currentLevel === "beginner") return c.timeLimit >= 3;
      if (currentLevel === "intermediate") return c.timeLimit >= 2 && c.timeLimit < 3;
      return c.timeLimit < 2;
    });
    
    if (levelChallenges.length > 0) {
      const randomChallenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setTimeLeft(randomChallenge.timeLimit);
      setTimerProgress(100);
      setShowTranslation(false);
      
      // Start the timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          setTimerProgress((newTime / randomChallenge.timeLimit) * 100);
          
          if (newTime <= 0) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 100);
      
      // Clean up timer when component unmounts or challenge changes
      return () => clearInterval(timer);
    }
  }, [currentLevel]);
  
  // Start a practice word
  const startPracticeWord = () => {
    const randomWord = basicWordPairs[Math.floor(Math.random() * basicWordPairs.length)];
    setPracticeWord(randomWord);
    setIsFlipped(false);
    setShowTranslation(false);
  };
  
  // Handle when time is up
  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: `The translation was: ${currentChallenge?.translation}`,
      variant: "destructive",
    });
    setStreak(0);
    nextChallenge();
  };
  
  // Handle correct answer
  const handleCorrect = () => {
    if (!currentChallenge) return;
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }
    
    setScore((prev) => prev + currentChallenge.points);
    
    toast({
      title: "Correct!",
      description: `+${currentChallenge.points} points! Streak: ${newStreak}`,
      variant: "default",
    });
    
    nextChallenge();
  };
  
  // Go to next challenge
  const nextChallenge = () => {
    if (gameMode === "challenge") {
      startNewChallenge();
    } else {
      startPracticeWord();
    }
  };
  
  // Stop the game
  const stopGame = () => {
    setIsPlaying(false);
    setCurrentChallenge(null);
  };
  
  // Handle flip for practice mode
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Handle reveal in challenge mode
  const handleReveal = () => {
    setShowTranslation(true);
  };
  
  // Play text-to-speech
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Change difficulty level
  const handleLevelChange = (level: string) => {
    setCurrentLevel(level as "beginner" | "intermediate" | "advanced");
    if (isPlaying && gameMode === "challenge") {
      stopGame();
      setTimeout(() => {
        startGame();
      }, 500);
    }
  };
  
  // Handle tab change between practice and challenge
  const handleTabChange = (value: string) => {
    setGameMode(value as "practice" | "challenge");
    stopGame();
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col items-center p-4 md:p-8">
          <header className="w-full max-w-4xl mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
              Reflex Challenge
            </h1>
            <p className="text-gray-600">
              Test your translation speed and language reflexes
            </p>
          </header>
          
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <Select value={currentLevel} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              {gameMode === "challenge" && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Score: {score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Streak: {streak}</span>
                    <span className="text-xs text-gray-500">(Best: {bestStreak})</span>
                  </div>
                </div>
              )}
            </div>
            
            <Tabs value={gameMode} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="practice">Practice Mode</TabsTrigger>
                <TabsTrigger value="challenge">Challenge Mode</TabsTrigger>
              </TabsList>
              <TabsContent value="practice">
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <h2 className="text-xl font-medium">Practice Your Reflexes</h2>
                    <p className="text-sm text-gray-500">
                      Flip the card to check your translation speed
                    </p>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {!practiceWord ? (
                      <Button onClick={startPracticeWord} className="mx-auto">
                        <Play className="mr-2 h-4 w-4" />
                        Start Practice
                      </Button>
                    ) : (
                      <div 
                        className={`w-full max-w-md aspect-[3/2] relative ${
                          isFlipped ? 'rotate-y-180' : ''
                        } transition-all duration-500 perspective-1000 cursor-pointer`}
                        onClick={handleFlip}
                      >
                        <div 
                          className={`absolute inset-0 backface-hidden ${
                            isFlipped ? 'opacity-0' : 'opacity-100'
                          } bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6 border-2 border-primary`}
                        >
                          <h3 className="text-3xl font-bold mb-4">{practiceWord.english}</h3>
                          <p className="text-gray-500 mb-4">Click to see translation</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(practiceWord.english);
                            }}
                            className="mt-2"
                          >
                            <Volume2 className="h-4 w-4 mr-2" />
                            Listen
                          </Button>
                        </div>
                        <div 
                          className={`absolute inset-0 backface-hidden ${
                            isFlipped ? 'opacity-100' : 'opacity-0'
                          } bg-primary/10 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 border-2 border-primary rotate-y-180`}
                        >
                          <h3 className="text-3xl font-bold text-primary mb-4">
                            {practiceWord.translation}
                          </h3>
                          <p className="text-gray-500 mb-4">Click to see word</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(practiceWord.translation);
                            }}
                            className="mt-2"
                          >
                            <Volume2 className="h-4 w-4 mr-2" />
                            Listen
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    {practiceWord && (
                      <Button onClick={startPracticeWord} className="mx-auto">
                        Next Word
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="font-medium">How to Practice</h3>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click "Start Practice" to begin</li>
                      <li>Try to remember the translation quickly</li>
                      <li>Click the card to flip and check your answer</li>
                      <li>Click "Next Word" to continue practicing</li>
                      <li>When you're ready, try Challenge Mode!</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="challenge">
                <Card>
                  <CardHeader className="text-center">
                    <h2 className="text-xl font-medium">Translation Challenge</h2>
                    <p className="text-sm text-gray-500">
                      Translate words as quickly as possible to earn points
                    </p>
                  </CardHeader>
                  <CardContent>
                    {!isPlaying ? (
                      <div className="flex flex-col items-center py-12">
                        <Button onClick={startGame} size="lg" className="animate-pulse">
                          <Play className="mr-2 h-5 w-5" />
                          Start Challenge
                        </Button>
                      </div>
                    ) : countdown > 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-6xl font-bold text-primary animate-pulse">
                          {countdown}
                        </div>
                        <p className="text-gray-500 mt-4">Get ready!</p>
                      </div>
                    ) : currentChallenge ? (
                      <div className="flex flex-col items-center py-8">
                        <div className="w-full max-w-md mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-red-500" />
                              <span className="text-sm font-medium">
                                {timeLeft.toFixed(1)}s
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              +{currentChallenge.points} points
                            </div>
                          </div>
                          <Progress value={timerProgress} className="h-2" />
                        </div>
                        
                        <div className="text-4xl font-bold mb-8">
                          {currentChallenge.word}
                        </div>
                        
                        {showTranslation ? (
                          <div className="text-2xl font-medium text-primary mb-8">
                            {currentChallenge.translation}
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            onClick={handleReveal}
                            className="mb-8"
                          >
                            Reveal Translation
                          </Button>
                        )}
                        
                        <div className="flex gap-4">
                          <Button 
                            onClick={handleCorrect} 
                            className="bg-green-500 hover:bg-green-600"
                          >
                            I Got It Right
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={nextChallenge}
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {isPlaying ? (
                      <Button variant="outline" onClick={stopGame}>
                        End Challenge
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {currentLevel === "beginner" 
                          ? "Beginner: 3 seconds per word" 
                          : currentLevel === "intermediate" 
                            ? "Intermediate: 2-3 seconds per word"
                            : "Advanced: 1-2 seconds per word"}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReflexChallenge;
