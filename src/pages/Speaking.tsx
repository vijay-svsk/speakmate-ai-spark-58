
import React, { useRef, useState } from "react";
import { Mic, CircleStop, ChartBar, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ResponsiveContainer, RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";

// Sample topics for the speaking practice select dropdown
const sampleTopics = [
  "Daily Life",
  "Travel",
  "Work and Career",
  "Food & Cooking",
  "Education",
  "Relationships",
  "Technology",
];

// Set up SpeechRecognition cross-browser
const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : undefined;

export default function Speaking() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start recording (audio + live transcript)
  const handleStart = async () => {
    setTranscript("");
    setFeedback(null);
    setAudioUrl(null);
    setRecording(true);

    // Start SpeechRecognition if available
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let runningTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          runningTranscript += event.results[i][0].transcript;
        }
        setTranscript(runningTranscript.trim());
      };
      recognition.onerror = (event: any) => {
        toast({
          title: "Speech recognition error",
          description: event.error || "Unknown recognition error.",
        });
      };
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Live transcription isn't available in your browser.",
      });
    }

    // Start audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      toast({
        title: "Could not access microphone",
        description: "Please allow microphone permission.",
      });
      setRecording(false);
    }
  };

  // Stop recording (audio + live transcript)
  const handleStop = () => {
    setRecording(false);
    // Stop SpeechRecognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    // Stop audio recording
    mediaRecorderRef.current?.stop();
  };

  // Analyze button - send transcript to Gemini API and get feedback
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast({ title: "No transcript available", description: "Please record some speech first." });
      return;
    }
    setLoading(true);
    try {
      // Compose Gemini prompt
      const speechText = transcript;
      const prompt = [
        {
          parts: [{
            text: `Analyze the following English speech for language improvement:

Speech: '${speechText}'

I want you to:
1. Highlight the grammar mistakes
2. Provide corrected version
3. Explain each grammar rule violated
4. Score the speech on:
   - Grammar
   - Vocabulary
   - Pronunciation (assume basic average)
   - Fluency
5. Give 3 communication improvement suggestions
6. Use a friendly coaching tone.
7. Output in clean JSON with keys:
   - original_text
   - corrected_text
   - highlighted_errors
   - grammar_explanations
   - scores (0-100)
   - suggestions
`
          }]
        }
      ];

      const apiRes = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCryO_r4qNiDoBIq2yqIb_EbjmqoOMmYBQ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: prompt }),
        }
      );
      const json = await apiRes.json();

      // Try to extract strict JSON (Gemini sometimes returns markdown code).
      const text = (json?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
      let feedbackObj = null;
      try {
        // Remove markdown code fences if present
        let cleanText = text;
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
        }
        feedbackObj = JSON.parse(cleanText.match(/\{[\s\S]*\}/)?.[0] ?? cleanText);
      } catch (e) {
        feedbackObj = { raw: text }; // fallback: show as raw text
      }
      setFeedback(feedbackObj);
    } catch (e: any) {
      toast({ title: "Analysis failed", description: "Could not reach Gemini API." });
    }
    setLoading(false);
  };

  // Highlight errors in transcript: error words displayed with a tooltip
  function highlightErrors(original: string, highlighted_errors?: any[]) {
    if (!highlighted_errors?.length) return original;
    let highlighted = original;
    highlighted_errors.forEach((err) => {
      if (err.error) {
        // Naive replacement - ideally word-boundary match
        highlighted = highlighted.replace(
          new RegExp(err.error, "gi"),
          `<span class="text-red-600 font-semibold underline decoration-wavy decoration-red-500 cursor-pointer" title="${err.rule || ""}">${err.error}</span>`
        );
      }
    });
    return highlighted;
  }

  return (
    <div className="mx-auto max-w-2xl py-8 sm:py-12 w-full px-2">
      <Card className="mb-6 shadow-xl animate-fade-in rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-bold font-playfair text-primary">Speaking Practice</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Topic Select */}
          <div>
            <label className="font-semibold">Choose a topic</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select topic..." />
              </SelectTrigger>
              <SelectContent>
                {sampleTopics.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recorder */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStart}
              disabled={recording}
              variant="default"
              className="flex gap-2"
              aria-label="Start Speaking"
            >
              <Mic className="w-5 h-5" />
              Speak
            </Button>
            <Button
              onClick={handleStop}
              disabled={!recording}
              variant="secondary"
              className="flex gap-2"
              aria-label="Stop Recording"
            >
              <CircleStop className="w-5 h-5" />
              Stop
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!transcript || loading}
              variant="outline"
              className="flex gap-2"
              aria-label="Analyze"
            >
              Analyze
            </Button>
          </div>

          {/* Transcript Display */}
          <Textarea
            className="text-base"
            rows={3}
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Transcript will appear here..."
          />

          {/* Audio playback */}
          {audioUrl && (
            <audio controls className="mt-2 w-full">
              <source src={audioUrl} />
              Your browser does not support audio.
            </audio>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="mt-4 flex justify-center">
          <div className="animate-pulse text-primary">🙌 Analyzing your speech...</div>
        </div>
      )}
      {feedback && (
        <div className="space-y-6">
          {/* Radar Chart */}
          {feedback.scores && (
            <Card className="shadow rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChartBar className="text-primary" />
                  <span className="font-semibold text-primary font-playfair">Your Skills</span>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RChart
                    outerRadius={90}
                    data={[
                      { subject: "Grammar", A: feedback.scores.grammar, fullMark: 100 },
                      { subject: "Vocabulary", A: feedback.scores.vocabulary, fullMark: 100 },
                      { subject: "Pronunciation", A: feedback.scores.pronunciation, fullMark: 100 },
                      { subject: "Fluency", A: feedback.scores.fluency, fullMark: 100 },
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="You" dataKey="A" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.4} />
                    <Tooltip />
                  </RChart>
                </ResponsiveContainer>
                <div className="text-xs mt-2 text-muted-foreground">
                  Scores are out of 100.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Highlighted errors */}
          {feedback.highlighted_errors && feedback.original_text && (
            <Card className="shadow rounded-xl bg-amber-50 border border-amber-200">
              <CardHeader>
                <span className="font-semibold text-amber-900">Mistake Highlights</span>
              </CardHeader>
              <CardContent>
                <div
                  className="text-base"
                  dangerouslySetInnerHTML={{ __html: highlightErrors(feedback.original_text, feedback.highlighted_errors) }}
                />
                {feedback.grammar_explanations?.length ? (
                  <ul className="mt-3 list-disc ml-6 text-sm text-gray-700">
                    {feedback.grammar_explanations.map((exp: string, i: number) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {feedback.suggestions && (
            <Card className="rounded-xl bg-primary/10 border-0">
              <CardHeader>
                <span className="font-semibold text-primary">Gemini Suggests</span>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-gray-700">
                  {feedback.suggestions.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Corrected Text */}
          {feedback.corrected_text && (
            <Card className="rounded-xl border-0 bg-green-50">
              <CardHeader>
                <span className="font-semibold text-green-700">Improved Version</span>
              </CardHeader>
              <CardContent>
                <div className="font-mono">{feedback.corrected_text}</div>
              </CardContent>
            </Card>
          )}

          {/* Fallback Raw response (in case JSON failed) */}
          {feedback.raw && (
            <Card className="rounded-xl">
              <CardHeader>Gemini Response</CardHeader>
              <CardContent>
                <pre className="text-xs whitespace-pre-wrap">{feedback.raw}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ... file is getting too long, please ask to refactor after this change!
