
import React, { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Webcam, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

// Sample syllables breakdown for "Elephant"
const sampleSyllables = [
  { part: "E", tip: "Open mouth, short 'eh' sound" },
  { part: "le", tip: "Lift tongue to roof" },
  { part: "phant", tip: "Lower jaw, f sound with teeth on lip" },
];
const samplePhonemeAccuracy = [
  { name: "E", value: 90 },
  { name: "le", value: 60 },
  { name: "phant", value: 80 },
];

const COLORS = ["#00c853", "#ffd600", "#ff5252"];

const levels = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export default function MirrorPractice() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const [level, setLevel] = useState("beginner");
  const [word, setWord] = useState("Elephant");
  const [syllables, setSyllables] = useState(sampleSyllables);
  const [score, setScore] = useState(82);
  const [pie, setPie] = useState(samplePhonemeAccuracy);
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState("Try to open your mouth a bit wider on 'E'.");
  const [stars, setStars] = useState(3);

  // NOTE: MediaPipe integration will be stubbed for now
  useEffect(() => {
    // Try to attach webcam
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
          // Handle camera denied
        });
    }
    // Cleanup
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        (webcamRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulated generate word (would use Gemini API in production)
  const handleNewWord = () => {
    setWord("Elephant");
    setSyllables(sampleSyllables);
    setScore(0);
    setStars(0);
    setPie(samplePhonemeAccuracy);
    setFeedback("");
  };

  // Simulated “Analyze” button
  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setScore(82);
      setStars(3);
      setFeedback("Great effort! Try to open your mouth a bit wider on 'E'. 'le' could be clearer.");
      setPie(samplePhonemeAccuracy);
      setAnalyzing(false);
    }, 1700);
  };

  // Gamified feedback UI
  return (
    <AppLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="p-1 overflow-visible animate-fade-in shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold font-playfair gradient-text">
              <Webcam className="w-7 h-7" />
              MirrorPractice
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
                        className="rounded-lg bg-primary/10 px-4 py-2 flex flex-col items-center shadow text-sm"
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
                  {/* Native Speaker Reference (Animated image or small demo video) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[170px] h-[128px] bg-gray-200 dark:bg-gray-700 mb-2 rounded-lg shadow-inner flex items-center justify-center border border-gray-300 dark:border-gray-600">
                      {/* Placeholder: Animate emoji silhouette */}
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="text-[70px] select-none"
                        role="img"
                        aria-label="Mouth demo"
                      >
                        🗣️
                      </motion.span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">Native Model</span>
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
                    onClick={() => setRecording(true)}
                    variant={recording ? "secondary" : "default"}
                    className="flex gap-1 items-center"
                    disabled={recording || analyzing}
                  >
                    <Mic className="w-5 h-5 mr-1" />
                    {recording ? "Recording..." : "Test"}
                  </Button>
                  <Button
                    onClick={() => setRecording(false)}
                    variant="outline"
                    className="flex gap-1 items-center"
                    disabled={!recording}
                  >
                    <Volume2 className="w-5 h-5 mr-1" />
                    Repeat
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    variant="default"
                    className="flex gap-1 items-center"
                    disabled={analyzing}
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
                    Per-phoneme accuracy score (demo)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
