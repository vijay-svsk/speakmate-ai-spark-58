
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Smile, Mic } from "lucide-react";

const LEVELS = [
  { value: "Beginner", label: "Beginner 😊" },
  { value: "Intermediate", label: "Intermediate 😃" },
  { value: "Advanced", label: "Advanced 😎" },
];

// Just a local emoji feedback for the encouragement.
const ENCOURAGEMENTS = [
  "🌟 Awesome effort!",
  "👏 Keep going!",
  "🙌 Great work!",
  "🔥 You're improving!",
  "😊 Fantastic try!",
];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const defaultWordInfo = {
  word: "",
  ipa: "",
  syllables: [],
  tips: [],
  sampleSentence: "",
  encouragement: "",
};

const defaultAnalysis = {
  score: null as null | number,
  confidence: null as null | number,
  syllableMatch: null as null | number,
  fluency: null as null | number,
  feedback: "",
  highlights: [] as string[],
  partAnalysis: [] as { part: string; feedback: string }[],
  suggestions: "",
  practiceWords: [] as string[],
};

const colors = ["#6366F1", "#22C55E", "#F59E42", "#F43F5E"];

export default function Pronunciation() {
  const [level, setLevel] = useState<string | null>(null);
  const [wordInfo, setWordInfo] = useState<typeof defaultWordInfo>(defaultWordInfo);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [analysis, setAnalysis] = useState<typeof defaultAnalysis>(defaultAnalysis);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -- Gemini API functions (simulate for now with static, real call logic below) --
  async function fetchWordInfo(selectedLevel: string) {
    setIsLoadingWord(true);
    setError(null);
    setWordInfo(defaultWordInfo);
    // [    Instead, you'd call Gemini here.  ]
    // Here's a mock prompt for the API:
    const geminiPrompt = `
Generate ONE English word for a ${selectedLevel.toLowerCase()} learner, provide:
- The word (capitalized, bold),
- IPA,
- Syllable/phoneme breakdown (array),
- Simple tip for each part ("tip" per syllable),
- A simple example sentence,
- One sentence encouragement with fitting emoji.

Reply as:
{
  "word": "",
  "ipa": "",
  "syllables": [ ],
  "tips": [ ],
  "sampleSentence": "",
  "encouragement": ""
}
Only valid JSON.
    `;
    // Example response (for Beginner: "cat")
    // Replace with Gemini call, parse .text as JSON
    await new Promise((r) => setTimeout(r, 900)); // simulate
    setWordInfo({
      word: "Cat",
      ipa: "/kæt/",
      syllables: ["cat"],
      tips: ["Relax your mouth, quick 'k' sound, open your mouth for 'a', finish softly."],
      sampleSentence: "The cat sat on the mat.",
      encouragement: getRandom(ENCOURAGEMENTS),
    });
    setIsLoadingWord(false);
  }

  // ----- Recording -----
  let recorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  async function startRecording() {
    setRecording(true);
    setError(null);
    setAudioURL(null);
    setBlob(null);
    setAnalysis(defaultAnalysis);
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new window.MediaRecorder(stream);
    recorder.ondataavailable = (e) => audioChunks.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setBlob(audioBlob);
      setAudioURL(URL.createObjectURL(audioBlob));
    };
    recorder.start();
    // Save to window for stopping later
    (window as any).__mirrorRecorder = recorder;
  }
  function stopRecording() {
    setRecording(false);
    try {
      ((window as any).__mirrorRecorder as MediaRecorder)?.stop();
    } catch {}
  }

  // -- Gemini "pronunciation feedback" (simulate, use blob:audio) --
  async function analyzePronunciation() {
    setIsLoadingAnalysis(true);
    setError(null);
    // Example prompt (real: send the audio as base64 and word/ipa/syllables)
    const prompt = `
You are an English pronunciation coach. Analyze if the user pronounced "${wordInfo.word}" correctly. Give:
- Score out of 100 (pronunciation accuracy)
- Confidence score (0-100)
- Syllable/phoneme match % (0-100)
- Word fluency (0-100)
- Short feedback highlighting any mispronounced parts
- Array of { part: syllable/phoneme, feedback: string }
- Suggestions for improvement ("You can try opening your mouth wider...", motivating style)
- 2 practice words similar to the parts mispronounced

Reply this JSON:
{
  "score": 88,
  "confidence": 89,
  "syllableMatch": 86,
  "fluency": 85,
  "feedback": "",
  "highlights": [ "a" ],
  "partAnalysis": [ { "part": "a", "feedback": "Try a more open sound for 'a'." } ],
  "suggestions": "",
  "practiceWords": [ "bat", "cab" ]
}
Only valid JSON.
    `;
    // Simulate result:
    await new Promise((r) => setTimeout(r, 1300));
    setAnalysis({
      score: 88,
      confidence: 89,
      syllableMatch: 86,
      fluency: 85,
      feedback: "Pretty good! The 'a' can be more open. Finish gently.",
      highlights: ["a"],
      partAnalysis: [
        { part: "a", feedback: "Try a more open sound for 'a'." }
      ],
      suggestions: "Open your mouth wide for 'a'. Try to relax your jaw for a more natural sound. You're almost perfect!",
      practiceWords: ["bat", "cab"]
    });
    setIsLoadingAnalysis(false);
  }

  // Pie chart data
  const chartData = [
    { name: "Accuracy", value: analysis.score || 0 },
    { name: "Confidence", value: analysis.confidence || 0 },
    { name: "Syllable Match", value: analysis.syllableMatch || 0 },
    { name: "Fluency", value: analysis.fluency || 0 },
  ];

  return (
    <div className="flex justify-center py-8 min-h-screen bg-gradient-to-br from-[#f5eefd] to-[#e5f2fd] animate-fade-in">
      <Card className="w-full max-w-lg animate-scale-in shadow-2xl">
        <CardHeader>
          <CardTitle className="font-playfair text-primary text-3xl text-center">
            Pronunciation Mirror
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Level Selection */}
          <div className="mb-6">
            <label className="font-semibold block mb-2">Select your level:</label>
            <Select value={level ?? undefined} onValueChange={v => {setLevel(v); fetchWordInfo(v);}}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map(lvl => (
                  <SelectItem key={lvl.value} value={lvl.value}>{lvl.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Display Word & Details */}
          {isLoadingWord && <div className="py-8 text-center animate-pulse">Loading word...</div>}
          {(wordInfo.word && !isLoadingWord) && (
            <div className="mb-5">
              <div className="text-xl font-bold text-center mb-1">Word:
                <span className="ml-2 text-2xl text-secondary font-extrabold">{wordInfo.word}</span>
              </div>
              <div className="text-center text-purple-600 font-mono mb-2">IPA: <span className="font-semibold">{wordInfo.ipa}</span></div>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {wordInfo.syllables.map((syl, i) =>
                  <div key={i} className={`px-3 py-1 rounded bg-blue-100 text-primary font-medium border ${analysis.highlights?.includes(syl) ? "border-red-400 bg-red-100 animate-pulse" : "border-transparent"}`}>
                    {syl}
                  </div>
                )}
              </div>
              <ul className="mb-2 px-3 list-disc text-muted-foreground">
                {wordInfo.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
              <div className="mb-2 italic text-green-700 text-lg text-center px-2">&ldquo;{wordInfo.sampleSentence}&rdquo;</div>
              <div className="text-2xl flex items-center justify-center font-bold animate-bounce">{wordInfo.encouragement || getRandom(ENCOURAGEMENTS)}</div>
            </div>
          )}

          {/* Recording Controls */}
          {(wordInfo.word && !isLoadingWord) && (
            <div className="mb-6 flex flex-col items-center gap-2">
              <Button
                variant={recording ? "destructive" : "secondary"}
                size="lg"
                className="w-40 flex items-center gap-2 animate-pulse transition-all"
                onClick={recording ? stopRecording : startRecording}
                disabled={isLoadingAnalysis || isLoadingWord}
              >
                <Mic className="mr-2" />
                {recording ? "Stop" : "Record"}
              </Button>
              {audioURL && (
                <div className="mt-2 flex flex-col gap-2 items-center">
                  <audio src={audioURL} controls className="w-full" />
                  <Button 
                    onClick={analyzePronunciation}
                    disabled={isLoadingAnalysis}
                    className={`${isLoadingAnalysis ? "animate-pulse" : ""} w-40`}
                  >
                    {isLoadingAnalysis ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {(analysis.score !== null && !isLoadingAnalysis) && (
            <div className="space-y-4 animate-enter">
              <div className="font-bold text-center text-primary text-xl mb-1">🎯 Analysis Results</div>
              {/* Pie Chart */}
              <div className="w-full flex justify-center">
                <ResponsiveContainer width="90%" height={160}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Feedback */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="font-semibold text-neutral-700">Accuracy:</span> <span className="text-primary">{analysis.score}/100</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Confidence:</span> <span className="text-primary">{analysis.confidence}%</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Syllable Match:</span> <span className="text-primary">{analysis.syllableMatch}%</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Fluency:</span> <span className="text-primary">{analysis.fluency}/100</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/40 rounded">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  <Smile className="text-green-600" />
                  Coach says:
                </div>
                <div className="mb-1">{analysis.feedback}</div>
                <ul className="list-disc ml-6">
                  {analysis.partAnalysis.map((p, i) => (
                    <li key={i}><b>{p.part}:</b> {p.feedback}</li>
                  ))}
                </ul>
                <div className="mt-1 text-pink-600">{analysis.suggestions}</div>
              </div>
              <div>
                <div className="font-semibold">🔄 Practice words:</div>
                <div className="flex gap-3">
                  {analysis.practiceWords.map((w, i) => (
                    <div key={i} className="bg-blue-50 rounded px-3 py-1 text-primary font-medium">{w}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <div className="mt-3 text-red-600 text-center">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
