
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Play, Award, Clock, Volume2, Zap, MicOff, Mic, Check, CircleX } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

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

// New speaking prompts for timed speaking tasks
const speakingPrompts = [
  "Describe your favorite hobby in three sentences.",
  "What did you do last weekend?",
  "Talk about your favorite movie.",
  "Describe your ideal vacation destination.",
  "What's your favorite food and why?",
  "If you could have any superpower, what would it be?",
  "Describe your morning routine.",
  "What's your favorite season and why?",
  "Tell me about your family.",
  "What are your plans for next year?"
];

// Fast thinking drill questions
const fastThinkingQuestions = [
  { question: "What's the opposite of 'hot'?", answer: "cold" },
  { question: "What color is the sky on a clear day?", answer: "blue" },
  { question: "How many days are in a week?", answer: "seven" },
  { question: "What comes after Monday?", answer: "tuesday" },
  { question: "What's 2+2?", answer: "four" },
  { question: "What season comes after winter?", answer: "spring" },
  { question: "What planet do we live on?", answer: "earth" },
  { question: "What's the first month of the year?", answer: "january" },
  { question: "What animal says 'meow'?", answer: "cat" },
  { question: "What do you use to write on paper?", answer: "pen" },
];

// Common grammar errors to detect in real-time
const grammarErrors = [
  { error: "is not", correct: "isn't", rule: "Use contractions in spoken English" },
  { error: "do not", correct: "don't", rule: "Use contractions in spoken English" },
  { error: "i am", correct: "I'm", rule: "Use contractions in spoken English" },
  { error: "very very", correct: "very", rule: "Avoid repetitive intensifiers" },
  { error: "more better", correct: "better", rule: "Don't use 'more' with comparative adjectives" },
  { error: "less smaller", correct: "smaller", rule: "Don't use 'less' with comparative adjectives" },
  { error: "i think that", correct: "I think", rule: "Omit 'that' when possible" },
  { error: "in my opinion i think", correct: "I think", rule: "Avoid redundant phrases" },
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
  const [gameMode, setGameMode] = useState<"practice" | "challenge" | "speaking" | "fastThinking">("practice");
  const [practiceWord, setPracticeWord] = useState<WordPair | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [timerProgress, setTimerProgress] = useState(100);
  const [currentSpeakingPrompt, setCurrentSpeakingPrompt] = useState("");
  const [currentFastThinkingQuestion, setCurrentFastThinkingQuestion] = useState<{question: string, answer: string}|null>(null);
  const [levelUpMode, setLevelUpMode] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [grammarErrors, setGrammarErrors] = useState<{error: string, correct: string, position: [number, number]}[]>([]);
  
  // Speech recognition hook
  const {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    supported
  } = useSpeechRecognition();
  
  const responseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update user response when transcript changes
    if (isListening && transcript) {
      setUserResponse(transcript);
      
      // Analyze grammar in real-time
      analyzeGrammar(transcript);
    }
  }, [transcript, isListening]);
  
  // Grammar analysis function
  const analyzeGrammar = (text: string) => {
    const errors: {error: string, correct: string, position: [number, number]}[] = [];
    
    grammarErrors.forEach(err => {
      const regex = new RegExp(`\\b${err.error}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        errors.push({
          error: match[0],
          correct: err.correct,
          position: [match.index, match.index + match[0].length]
        });
      }
    });
    
    setGrammarErrors(errors);
  };
  
  // Initialize or reset the game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setStreak(0);
    setCountdown(3);
    resetTranscript();
    setUserResponse("");
    setGrammarErrors([]);
    
    // Start countdown and then first challenge
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          
          if (gameMode === "challenge") {
            startNewChallenge();
          } else if (gameMode === "speaking") {
            startSpeakingChallenge();
          } else if (gameMode === "fastThinking") {
            startFastThinkingDrill();
          } else {
            startPracticeWord();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [gameMode, levelUpMode, resetTranscript]);
  
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
      
      // Apply level-up mode - reduce time by 25%
      let adjustedTimeLimit = randomChallenge.timeLimit;
      if (levelUpMode) {
        adjustedTimeLimit = Math.max(1, adjustedTimeLimit * 0.75);
      }
      
      setCurrentChallenge({
        ...randomChallenge,
        timeLimit: adjustedTimeLimit
      });
      setTimeLeft(adjustedTimeLimit);
      setTimerProgress(100);
      setShowTranslation(false);
      
      // Start the timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          setTimerProgress((newTime / adjustedTimeLimit) * 100);
          
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
  }, [currentLevel, levelUpMode]);
  
  // Start a speaking challenge
  const startSpeakingChallenge = () => {
    const randomPrompt = speakingPrompts[Math.floor(Math.random() * speakingPrompts.length)];
    setCurrentSpeakingPrompt(randomPrompt);
    setUserResponse("");
    resetTranscript();
    
    // Set timer - 5 seconds by default, 4 seconds in level-up mode
    const speakingTimeLimit = levelUpMode ? 4 : 5;
    setTimeLeft(speakingTimeLimit);
    setTimerProgress(100);
    
    // Start listening
    startListening();
    
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        setTimerProgress((newTime / speakingTimeLimit) * 100);
        
        if (newTime <= 0) {
          clearInterval(timer);
          stopListening();
          
          // Evaluate response
          if (transcript.trim().length > 0) {
            // User said something
            setScore(prev => prev + 10);
            toast({
              title: "Time's up!",
              description: "You responded in time. Good job!",
            });
          } else {
            // User didn't respond in time
            toast({
              title: "Time's up!",
              description: "You didn't respond in time.",
              variant: "destructive",
            });
          }
          
          // Move to next challenge after a short delay
          setTimeout(() => {
            startSpeakingChallenge();
          }, 2000);
          
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    // Clean up
    return () => {
      clearInterval(timer);
      stopListening();
    };
  };
  
  // Start a fast thinking drill
  const startFastThinkingDrill = () => {
    const randomQuestion = fastThinkingQuestions[Math.floor(Math.random() * fastThinkingQuestions.length)];
    setCurrentFastThinkingQuestion(randomQuestion);
    setUserResponse("");
    resetTranscript();
    
    // Set timer - 3 seconds by default, 2 seconds in level-up mode
    const thinkingTimeLimit = levelUpMode ? 2 : 3;
    setTimeLeft(thinkingTimeLimit);
    setTimerProgress(100);
    
    // Start listening
    startListening();
    
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        setTimerProgress((newTime / thinkingTimeLimit) * 100);
        
        if (newTime <= 0) {
          clearInterval(timer);
          stopListening();
          
          // Check if answer is correct
          const userAnswer = transcript.trim().toLowerCase();
          const correctAnswer = randomQuestion.answer.toLowerCase();
          
          if (userAnswer.includes(correctAnswer)) {
            // Correct answer
            setScore(prev => prev + 15);
            setStreak(prev => prev + 1);
            toast({
              title: "Correct!",
              description: "Your answer was right! +15 points.",
            });
          } else if (userAnswer.length > 0) {
            // Incorrect but answered
            toast({
              title: "Time's up!",
              description: `The answer was "${randomQuestion.answer}".`,
              variant: "destructive",
            });
            setStreak(0);
          } else {
            // No answer
            toast({
              title: "Time's up!",
              description: "You didn't answer in time.",
              variant: "destructive",
            });
            setStreak(0);
          }
          
          // Update best streak
          setBestStreak(prev => Math.max(prev, streak + 1));
          
          // Move to next question after a short delay
          setTimeout(() => {
            startFastThinkingDrill();
          }, 2000);
          
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    // Clean up
    return () => {
      clearInterval(timer);
      stopListening();
    };
  };
  
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
    } else if (gameMode === "speaking") {
      startSpeakingChallenge();
    } else if (gameMode === "fastThinking") {
      startFastThinkingDrill();
    } else {
      startPracticeWord();
    }
  };
  
  // Stop the game
  const stopGame = () => {
    setIsPlaying(false);
    setCurrentChallenge(null);
    setCurrentSpeakingPrompt("");
    setCurrentFastThinkingQuestion(null);
    resetTranscript();
    stopListening();
    
    if (responseTimeout.current) {
      clearTimeout(responseTimeout.current);
    }
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
    if (isPlaying) {
      stopGame();
      setTimeout(() => {
        startGame();
      }, 500);
    }
  };
  
  // Handle tab change between practice and challenge
  const handleTabChange = (value: string) => {
    setGameMode(value as "practice" | "challenge" | "speaking" | "fastThinking");
    stopGame();
  };
  
  // Render text with grammar error highlights
  const renderWithHighlights = (text: string) => {
    if (!text || grammarErrors.length === 0) {
      return <span>{text}</span>;
    }
    
    // Sort errors by position
    const sortedErrors = [...grammarErrors].sort((a, b) => a.position[0] - b.position[0]);
    
    // Build text with highlights
    const result: JSX.Element[] = [];
    let lastIndex = 0;
    
    sortedErrors.forEach((error, i) => {
      const [start, end] = error.position;
      
      // Add text before error
      if (start > lastIndex) {
        result.push(<span key={`text-${i}`}>{text.substring(lastIndex, start)}</span>);
      }
      
      // Add highlighted error
      result.push(
        <span 
          key={`error-${i}`}
          className="text-red-500 underline decoration-wavy decoration-red-500"
          title={`Suggestion: ${error.correct}`}
        >
          {text.substring(start, end)}
        </span>
      );
      
      lastIndex = end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      result.push(<span key="text-last">{text.substring(lastIndex)}</span>);
    }
    
    return <>{result}</>;
  };
  
  // Effect to clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (responseTimeout.current) {
        clearTimeout(responseTimeout.current);
      }
    };
  }, [stopListening]);
  
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-4xl mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Reflex Challenge
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your speaking speed and language reflexes
          </p>
        </header>
        
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
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
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="levelUpMode"
                  checked={levelUpMode}
                  onChange={(e) => setLevelUpMode(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="levelUpMode" className="flex items-center text-sm cursor-pointer">
                  <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                  Level-Up Mode
                </label>
              </div>
            </div>
            
            {(gameMode === "challenge" || gameMode === "speaking" || gameMode === "fastThinking") && (
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="practice">Practice Mode</TabsTrigger>
              <TabsTrigger value="challenge">Translation Mode</TabsTrigger>
              <TabsTrigger value="speaking">Timed Speaking</TabsTrigger>
              <TabsTrigger value="fastThinking">Fast Thinking</TabsTrigger>
            </TabsList>
            
            {/* Practice Mode Tab */}
            <TabsContent value="practice">
              <Card className="mb-6 shadow-lg">
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
                      className={`w-full max-w-md aspect-[3/2] relative transition-all duration-500 perspective-1000 cursor-pointer`}
                      onClick={handleFlip}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : ''
                      }}
                    >
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 border-2 border-primary`}
                        style={{
                          backfaceVisibility: 'hidden',
                          opacity: isFlipped ? '0' : '1'
                        }}
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
                        className={`absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/20 rounded-xl shadow-lg flex flex-col items-center justify-center p-6 border-2 border-accent`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          opacity: isFlipped ? '1' : '0'
                        }}
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
              
              <Card className="shadow-lg">
                <CardHeader>
                  <h3 className="font-medium">How to Practice</h3>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Click "Start Practice" to begin</li>
                    <li>Try to remember the translation quickly</li>
                    <li>Click the card to flip and check your answer</li>
                    <li>Click "Next Word" to continue practicing</li>
                    <li>When you're ready, try our other challenge modes!</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Challenge Mode Tab */}
            <TabsContent value="challenge">
              <Card className="shadow-lg">
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
                          <Check className="mr-2 h-4 w-4" />
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
                    <Button variant="outline" onClick={stopGame} className="text-red-500">
                      End Challenge
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {currentLevel === "beginner" 
                        ? "Beginner: 3 seconds per word" 
                        : currentLevel === "intermediate" 
                          ? "Intermediate: 2-3 seconds per word"
                          : "Advanced: 1-2 seconds per word"}
                      {levelUpMode && " (Level-Up Mode: 25% less time!)"}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Speaking Mode Tab */}
            <TabsContent value="speaking">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <h2 className="text-xl font-medium">Timed Speaking Challenge</h2>
                  <p className="text-sm text-gray-500">
                    Respond to prompts within 5 seconds
                  </p>
                </CardHeader>
                <CardContent>
                  {!isPlaying ? (
                    <div className="flex flex-col items-center py-12">
                      {!supported ? (
                        <div className="text-center text-amber-600 mb-4">
                          <p>Speech recognition is not supported in your browser.</p>
                          <p className="text-sm mt-2">Try using Chrome or Edge for this feature.</p>
                        </div>
                      ) : (
                        <Button onClick={startGame} size="lg" className="animate-pulse">
                          <Play className="mr-2 h-5 w-5" />
                          Start Speaking Challenge
                        </Button>
                      )}
                    </div>
                  ) : countdown > 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-6xl font-bold text-primary animate-pulse">
                        {countdown}
                      </div>
                      <p className="text-gray-500 mt-4">Get ready to speak!</p>
                    </div>
                  ) : currentSpeakingPrompt ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="w-full max-w-md mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-sm font-medium">
                              {timeLeft.toFixed(1)}s
                            </span>
                          </div>
                          <div className="flex items-center">
                            {isListening ? (
                              <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                            ) : (
                              <MicOff className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs ml-1">
                              {isListening ? "Listening..." : "Not listening"}
                            </span>
                          </div>
                        </div>
                        <Progress value={timerProgress} className="h-2" />
                      </div>
                      
                      <div className="text-xl font-medium mb-6 text-center">
                        {currentSpeakingPrompt}
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 w-full max-w-md p-4 rounded-lg mb-6 min-h-[100px]">
                        <h4 className="text-sm text-gray-500 mb-2">Your response:</h4>
                        <p className="text-lg">{renderWithHighlights(userResponse)}</p>
                      </div>
                      
                      {grammarErrors.length > 0 && (
                        <div className="w-full max-w-md mb-4">
                          <h4 className="text-sm text-red-500 mb-1">Grammar issues detected:</h4>
                          <ul className="text-xs text-gray-600 dark:text-gray-300 list-disc pl-4">
                            {grammarErrors.map((err, i) => (
                              <li key={i}>
                                "{err.error}" could be "{err.correct}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={stopGame}
                        className="mt-2"
                      >
                        End Challenge
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!isPlaying && (
                    <div className="text-sm text-gray-500">
                      <p>Speak within {levelUpMode ? "4" : "5"} seconds of seeing the prompt</p>
                      <p className="mt-1">Grammar errors are highlighted in real-time</p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Fast Thinking Tab */}
            <TabsContent value="fastThinking">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <h2 className="text-xl font-medium">Fast Thinking Drill</h2>
                  <p className="text-sm text-gray-500">
                    Answer questions quickly to train your language reflexes
                  </p>
                </CardHeader>
                <CardContent>
                  {!isPlaying ? (
                    <div className="flex flex-col items-center py-12">
                      {!supported ? (
                        <div className="text-center text-amber-600 mb-4">
                          <p>Speech recognition is not supported in your browser.</p>
                          <p className="text-sm mt-2">Try using Chrome or Edge for this feature.</p>
                        </div>
                      ) : (
                        <Button onClick={startGame} size="lg" className="animate-pulse">
                          <Zap className="mr-2 h-5 w-5" />
                          Start Fast Thinking Drill
                        </Button>
                      )}
                    </div>
                  ) : countdown > 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="text-6xl font-bold text-primary animate-pulse">
                        {countdown}
                      </div>
                      <p className="text-gray-500 mt-4">Get ready to think fast!</p>
                    </div>
                  ) : currentFastThinkingQuestion ? (
                    <div className="flex flex-col items-center py-8">
                      <div className="w-full max-w-md mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-sm font-medium">
                              {timeLeft.toFixed(1)}s
                            </span>
                          </div>
                          <div className="flex items-center">
                            {isListening ? (
                              <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                            ) : (
                              <MicOff className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={timerProgress} className="h-2" />
                      </div>
                      
                      <div className="text-2xl font-bold mb-8 text-center bg-primary/10 p-4 rounded-lg w-full">
                        {currentFastThinkingQuestion.question}
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 w-full max-w-md p-4 rounded-lg mb-6">
                        <h4 className="text-sm text-gray-500 mb-2">Your answer:</h4>
                        <p className="text-xl">{userResponse || "..."}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={stopGame}
                        className="mt-2"
                      >
                        End Drill
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!isPlaying && (
                    <div className="text-sm text-gray-500">
                      <p>Answer within {levelUpMode ? "2" : "3"} seconds</p>
                      <p className="mt-1">The faster you answer correctly, the higher your streak!</p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Info Card */}
          <Card className="shadow-lg mt-6">
            <CardHeader>
              <h3 className="font-medium text-primary">How the Reflex Challenge Works</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Timed Speaking Tasks
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Respond within 5 seconds to prompts to improve your speaking reflexes and spontaneous language use.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Fast Thinking Drills
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Flashcard-like questions that need quick spoken answers to build vocabulary recall speed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <CircleX className="h-4 w-4 text-red-500" />
                    Real-Time Error Highlights
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Instantly shows grammar/word choice issues as you speak to improve accuracy.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    Level-Up Mode
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Activates harder challenges with shorter time limits and stricter scoring.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReflexChallenge;
