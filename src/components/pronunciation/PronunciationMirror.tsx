import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Webcam, Star, ArrowRight, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSpeechAudio } from "@/hooks/use-speech-audio";
import { toast } from "sonner";
import { LipSyncRobot } from "./LipSyncRobot";

// Sample syllables breakdown for different words
const wordLibrary = {
  beginner: [
    {
      word: "Elephant",
      syllables: [
        { part: "E", tip: "Open mouth, short 'eh' sound" },
        { part: "le", tip: "Lift tongue to roof" },
        { part: "phant", tip: "Lower jaw, f sound with teeth on lip" },
      ]
    },
    {
      word: "Hello",
      syllables: [
        { part: "He", tip: "Open mouth slightly, h from throat" },
        { part: "llo", tip: "Tongue behind teeth, round lips" },
      ]
    }
  ],
  intermediate: [
    {
      word: "Beautiful",
      syllables: [
        { part: "Beau", tip: "Purse lips together, then open" },
        { part: "ti", tip: "Tongue touches roof briefly" },
        { part: "ful", tip: "Lower lip touches upper teeth" },
      ]
    },
    {
      word: "Together",
      syllables: [
        { part: "To", tip: "Tongue behind teeth" },
        { part: "ge", tip: "Back of tongue raised" },
        { part: "ther", tip: "Tongue between teeth slightly" },
      ]
    }
  ],
  advanced: [
    {
      word: "Congratulations",
      syllables: [
        { part: "Con", tip: "Back of tongue raised" },
        { part: "gra", tip: "Lower jaw, g from throat" },
        { part: "tu", tip: "Tongue tip up" },
        { part: "la", tip: "Wide mouth opening" },
        { part: "tions", tip: "Tongue tip on teeth, then 's' sound" },
      ]
    },
    {
      word: "Particularly",
      syllables: [
        { part: "Par", tip: "Lips slightly apart" },
        { part: "ti", tip: "Tongue tip up" },
        { part: "cu", tip: "Back of tongue raised" },
        { part: "lar", tip: "Tongue relaxed" },
        { part: "ly", tip: "Tongue to roof of mouth" },
      ]
    }
  ]
};

const COLORS = ["#00c853", "#ffd600", "#ff5252"];

const levels = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export function PronunciationMirror() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const [level, setLevel] = useState("beginner");
  const [word, setWord] = useState("");
  const [syllables, setSyllables] = useState<{part: string, tip: string}[]>([]);
  const [score, setScore] = useState(0);
  const [pie, setPie] = useState<{name: string, value: number}[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [stars, setStars] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentPhoneme, setCurrentPhoneme] = useState("");
  const [isRobotAnimating, setIsRobotAnimating] = useState(false);
  
  const { 
    isListening, 
    transcript, 
    handleStartRecording, 
    handleStopRecording,
    speakText
  } = useSpeechAudio();

  // Initialize with first word on component mount
  useEffect(() => {
    handleNewWord();
  }, [level]);

  // Try to attach webcam
  useEffect(() => {
    if (webcamRef.current && !webcamRef.current.srcObject) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream;
            webcamRef.current.play();
          }
        })
        .catch(() => {
          toast.error("Camera access denied. Please enable your camera to use this feature.");
        });
    }
    
    // Cleanup webcam on unmount
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        (webcamRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle new word generation
  const handleNewWord = () => {
    const levelWords = wordLibrary[level as keyof typeof wordLibrary];
    let newIndex = currentWordIndex;
    
    // If we've used all words, go back to the first word
    if (newIndex >= levelWords.length) {
      newIndex = 0;
    }
    
    const wordData = levelWords[newIndex];
    setWord(wordData.word);
    setSyllables(wordData.syllables);
    setScore(0);
    setStars(0);
    setPie(wordData.syllables.map(s => ({ name: s.part, value: 0 })));
    setFeedback("");
    
    // Move to next word for next time
    setCurrentWordIndex(newIndex + 1);
  };

  // Pronounce the current word
  const handlePronounce = () => {
    speakText(word);
    setIsRobotAnimating(true);
    
    // Stop robot animation after word is spoken (approx. 3s)
    setTimeout(() => setIsRobotAnimating(false), 3000);
  };

  // Handle recording
  const handleRecord = () => {
    if (!isListening) {
      handleStartRecording();
    } else {
      handleStopRecording();
    }
  };

  // Simulated "Analyze" button
  const handleAnalyze = () => {
    if (!transcript) {
      toast.error("Please record your pronunciation first");
      return;
    }
    
    setAnalyzing(true);
    
    // Simulate analysis with random scores for demonstration
    setTimeout(() => {
      // Generate phoneme accuracy
      const phonemeScores = syllables.map(syl => {
        // Generate random score between 60-95 for demo
        return {
          name: syl.part,
          value: Math.floor(Math.random() * 35) + 60
        };
      });
      
      // Calculate overall score based on phoneme scores
      const overallScore = Math.floor(
        phonemeScores.reduce((sum, item) => sum + item.value, 0) / phonemeScores.length
      );
      
      setScore(overallScore);
      setPie(phonemeScores);
      
      // Set stars based on score
      let starCount = 0;
      if (overallScore >= 90) starCount = 3;
      else if (overallScore >= 75) starCount = 2;
      else if (overallScore >= 60) starCount = 1;
      setStars(starCount);
      
      // Generate feedback based on lowest scoring phoneme
      const lowestScore = phonemeScores.reduce(
        (min, p) => p.value < min.value ? p : min,
        { name: "", value: 100 }
      );
      
      const syllableTip = syllables.find(s => s.part === lowestScore.name)?.tip || "";
      
      setFeedback(
        overallScore >= 90
          ? "Excellent pronunciation! You're sounding like a native speaker."
          : `Good effort! Focus on the '${lowestScore.name}' sound. ${syllableTip}`
      );
      
      setAnalyzing(false);
    }, 1700);
  };

  // Handle specific phoneme demonstration
  const demonstratePhoneme = (phoneme: string) => {
    setCurrentPhoneme(phoneme);
    // Play a specific sound for this phoneme (simplified)
    speakText(phoneme);
  };

  return (
    <Card className="p-1 overflow-visible animate-fade-in shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold font-playfair gradient-text">
          <Webcam className="w-7 h-7" />
          LipSync AI
          <span
            className="ml-4 text-sm rounded px-2 py-1 bg-primary text-white font-normal tracking-wide"
            style={{ letterSpacing: ".08em" }}
          >
            Beta
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Controls & Info */}
          <div className="col-span-1 space-y-4">
            {/* Level Dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-1">Choose Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level..." />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem value={l.value} key={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* New Word Button */}
            <Button variant="secondary" className="mt-3 w-full" onClick={handleNewWord}>
              Generate Word
            </Button>
            {/* Word Display */}
            <div className="mt-4 font-bold text-lg text-primary tracking-wide">{word}</div>
            {/* Syllable Breakdown */}
            <div className="mt-2">
              <div className="font-semibold text-xs uppercase mb-1 text-muted-foreground">
                Syllable Breakdown
              </div>
              <div className="flex flex-wrap gap-2">
                {syllables.map((syl, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-primary/10 px-4 py-2 flex flex-col items-center shadow text-sm hover:bg-primary/20 cursor-pointer transition-colors"
                    onClick={() => demonstratePhoneme(syl.part)}
                  >
                    <span>{syl.part}</span>
                    <span className="text-[11px] text-muted-foreground">{syl.tip}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-lg bg-green-50 px-4 py-2 text-green-800 text-sm shadow-sm"
              >
                <b>Tip:</b> {feedback}
              </motion.div>
            )}
          </div>

          {/* Lip Sync Comparison Zone */}
          <div className="col-span-2 flex flex-col items-center gap-2">
            <div className="flex gap-8 items-end pt-1 pb-2">
              {/* Native Speaker Reference with Robot */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[170px] h-[128px] relative bg-gray-200 dark:bg-gray-700 mb-2 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <LipSyncRobot 
                    word={word} 
                    isAnimating={isRobotAnimating} 
                    phoneme={currentPhoneme}
                  />
                </div>
                <div className="flex items-center">
                  <Bot className="w-4 h-4 mr-1 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">LipSync AI</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-1"
                  onClick={handlePronounce}
                >
                  <Volume2 className="w-4 h-4 mr-1" /> Listen
                </Button>
              </div>
              {/* Webcam Feed + Overlay */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-[170px] h-[128px] rounded-lg shadow-inner overflow-hidden bg-black border border-primary">
                  <video
                    ref={webcamRef}
                    width={170}
                    height={128}
                    autoPlay
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover"
                    style={{ borderRadius: 12 }}
                  />
                  {/* Overlay sample: animated oval (simulate lip shape detection for demo) */}
                  <motion.div
                    animate={{
                      borderColor: ["#e53935", "#00c853", "#e53935"],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.7, repeat: Infinity }}
                    className="absolute left-1/2 top-3/4 w-20 h-7 rounded-full border-4 border-primary/70 bg-transparent pointer-events-none"
                    style={{
                      transform: "translate(-50%,-50%)",
                      borderRadius: "55% 45% 60% 40% / 50% 60% 40% 50%",
                    }}
                  ></motion.div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Your Mouth (Live)
                </span>
              </div>
            </div>
            {/* Control Buttons */}
            <div className="flex gap-3 mt-2">
              <Button
                onClick={handleRecord}
                variant={isListening ? "secondary" : "default"}
                className="flex gap-1 items-center"
                disabled={analyzing}
              >
                <Mic className="w-5 h-5 mr-1" />
                {isListening ? "Recording..." : "Test"}
              </Button>
              <Button
                onClick={handleStopRecording}
                variant="outline"
                className="flex gap-1 items-center"
                disabled={!isListening}
              >
                <Volume2 className="w-5 h-5 mr-1" />
                Stop
              </Button>
              <Button
                onClick={handleAnalyze}
                variant="default"
                className="flex gap-1 items-center"
                disabled={analyzing || !transcript}
              >
                {analyzing ? "Analyzing..." : "Analyze"}
              </Button>
              <Button
                onClick={handleNewWord}
                variant="ghost"
                className="flex gap-1 items-center"
              >
                Next Word <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {/* Transcription display */}
            {transcript && (
              <div className="mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md w-full max-w-md">
                <div className="text-xs text-muted-foreground mb-1">Your pronunciation:</div>
                <div className="text-sm">{transcript}</div>
              </div>
            )}
            {/* Feedback and scoring */}
            <div className="mt-6 px-4 w-full flex flex-col items-center gap-3">
              <div className="flex gap-3 items-center">
                {[1, 2, 3].map((n) => (
                  <Star
                    key={n}
                    className={`h-6 w-6 ${
                      score >= 80 && n <= stars
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={score >= 80 && n <= stars ? "#ffd600" : "none"}
                  />
                ))}
              </div>
              <div className="font-bold text-lg text-primary">
                {score > 0 ? `Your Match: ${score}%` : "No score yet"}
              </div>
              <Progress value={score} max={100} className="h-3 rounded-full bg-primary/5" />
              <div className="w-full flex justify-center mt-3">
                <PieChart width={140} height={100}>
                  <Pie
                    data={pie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={24}
                    outerRadius={40}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {pie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="text-xs text-muted-foreground">
                Per-phoneme accuracy score
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
