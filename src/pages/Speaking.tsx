import React, { useRef, useState, useEffect } from "react";
import { Mic, CircleStop, ChartBar, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const navigate = useNavigate();

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load the API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (!savedApiKey || savedApiKey.trim() === '') {
      toast.warning(
        "No API key found. Please set your Gemini API key in Settings",
        {
          action: {
            label: "Go to Settings",
            onClick: () => navigate('/settings')
          },
          duration: 10000,
        }
      );
    } else {
      setApiKey(savedApiKey);
    }
  }, [navigate]);

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
      recognition.onresult = (event: any) => {
        let runningTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          runningTranscript += event.results[i][0].transcript;
        }
        setTranscript(runningTranscript.trim());
      };
      recognition.onerror = (event: any) => {
        toast.error("Speech recognition error: " + (event.error || "Unknown recognition error."));
      };
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      toast.error("Speech recognition not supported. Live transcription isn't available in your browser.");
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
      toast.error("Could not access microphone. Please allow microphone permission.");
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

  // Analyze button - enhanced Gemini API prompt and response structure
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast.error("No transcript available. Please record some speech first.");
      return;
    }
    
    // Check if we have an API key
    if (!apiKey) {
      toast.error("No Gemini API key found. Please add one in settings.", {
        action: {
          label: "Settings",
          onClick: () => navigate('/settings')
        }
      });
      return;
    }
    
    setLoading(true);
    try {
      const speechText = transcript;
      // Enhanced Gemini Prompt per user request:
      const prompt = [
        {
          parts: [{
            text: `
You are an expert English language coach. I am building a website to help users improve their English speaking skills using AI. I will provide you with a transcript of what the user has spoken. Based on that transcript, give a detailed, structured, and friendly feedback report with the following sections:

1. **Corrected Version**: Rewrite the user's speech with proper grammar, vocabulary, and sentence structure.

2. **Highlight Mistakes**: List each mistake, the correction, and explain the grammar/vocabulary rule behind it in simple terms.

3. **Grammar, Vocabulary, Pronunciation, and Fluency Scores**:
   - Provide scores out of 100 for each category.
   - Categorize the score: 0-60 = Needs Improvement, 61-80 = Average, 81-100 = Good.
   - Explain why the score was given and what to improve.

4. **Pronunciation Analysis**:
   - Identify any difficult or mispronounced words.
   - Give phonetic tips and mouth movement advice.
   - Provide examples or similar words to practice.

5. **Fluency Feedback**:
   - Count filler words used ("um", "like", "uh").
   - Identify unnatural pauses or abrupt stops.
   - Suggest techniques for smoother speech.

6. **Vocabulary Enhancement**:
   - Identify basic or overused words in the transcript.
   - Suggest 2-3 better alternatives with sample sentences.

7. **Communication Tips**:
   - Give 3 personalized tips to help the user improve.
   - Make these encouraging and based on their performance.

8. **Final Summary**:
   - Provide an overall score and label (Beginner, Intermediate, Advanced).
   - Suggest if the user should retry or move to the next level.

Please make the feedback positive, constructive, and educational. Use clear formatting (like bullet points and bold titles) so it can be easily displayed in a dashboard.

Transcript:
"${speechText}"

Respond as clean JSON ONLY, using keys:
{
  corrected_version,
  mistakes: [{mistake, correction, explanation}],
  scores: {
    grammar: {score, label, explanation},
    vocabulary: {score, label, explanation},
    pronunciation: {score, label, explanation},
    fluency: {score, label, explanation}
  },
  pronunciation_feedback: { difficult_words, tips, example_words },
  fluency_feedback: { filler_words_count, unnatural_pauses, suggestions },
  vocabulary_enhancement: { basic_words, alternatives: [{word, alternatives, samples}] },
  communication_tips: [ ... ],
  overall_summary: { score, level, recommendation }
}
`
          }]
        }
      ];

      // Updated API endpoint to use the gemini-1.5-flash model for better compatibility
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: prompt }),
        }
      );
      
      // Log the API call for debugging
      console.log("API response status:", apiRes.status);
      
      const json = await apiRes.json();
      console.log("API response:", json);

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
        console.error("Error parsing JSON:", e);
        feedbackObj = { raw: text }; // fallback: show as raw text
      }
      setFeedback(feedbackObj);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error("Analysis failed. Could not reach Gemini API.");
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

  // Helper: Render grammar explanations safely
  function renderGrammarExplanation(exp: any, i: number) {
    if (typeof exp === "string") {
      return <li key={i}>{exp}</li>;
    }
    if (typeof exp === "object" && exp !== null && ("rule" in exp || "explanation" in exp)) {
      // Render rule and explanation if present
      return (
        <li key={i}>
          {exp.rule && <span className="font-semibold">{exp.rule}: </span>}
          {exp.explanation || JSON.stringify(exp)}
        </li>
      );
    }
    // fallback
    return <li key={i}>{JSON.stringify(exp)}</li>;
  }

  // Helper: Render structured score with categorization
  function renderScoreSection(title: string, data?: any) {
    if (!data) return null;
    return (
      <div className="mb-2">
        <div className="font-semibold">{title}:</div>
        <div className="flex gap-2 items-center">
          <span className={
            data.score >= 81
              ? "text-green-600 font-bold"
              : data.score >= 61
              ? "text-yellow-700 font-bold"
              : "text-red-600 font-bold"
          }>
            {data.score ?? "-"} / 100 ("{data.label ?? ""}")
          </span>
        </div>
        {data.explanation && (
          <div className="text-sm text-muted-foreground mt-1">{data.explanation}</div>
        )}
      </div>
    );
  }

  // Helper: Safe list mapping
  function safeList(arr: undefined | null | any[], f: (x:any,i:number)=>React.ReactNode) {
    return Array.isArray(arr) ? arr.map(f) : null;
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
              disabled={!transcript || loading || !apiKey}
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
          {/* 1. Corrected Version */}
          {feedback.corrected_version && (
            <Card className="rounded-xl border-0 bg-green-50 shadow">
              <CardHeader>
                <span className="font-bold text-green-700">Corrected Version</span>
              </CardHeader>
              <CardContent>
                <div className="font-mono">{feedback.corrected_version}</div>
              </CardContent>
            </Card>
          )}

          {/* 2. Highlight Mistakes */}
          {feedback.mistakes && feedback.mistakes.length > 0 && (
            <Card className="rounded-xl bg-amber-50 border border-amber-200 shadow">
              <CardHeader>
                <span className="font-semibold text-amber-900">Highlight Mistakes</span>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-4 space-y-2 text-sm">
                  {feedback.mistakes.map((m: any, idx: number) => (
                    <li key={idx}>
                      <b>Mistake:</b> <span className="text-red-600">{m.mistake}</span>
                      <br />
                      <b>Correction:</b> <span className="text-green-700">{m.correction}</span>
                      <br />
                      <b>Explanation:</b> <span>{m.explanation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 3. Scores */}
          {(feedback.scores?.grammar || feedback.scores?.vocabulary || feedback.scores?.pronunciation || feedback.scores?.fluency) && (
            <Card className="shadow rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary font-playfair">Score Breakdown</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderScoreSection("Grammar", feedback.scores.grammar)}
                  {renderScoreSection("Vocabulary", feedback.scores.vocabulary)}
                  {renderScoreSection("Pronunciation", feedback.scores.pronunciation)}
                  {renderScoreSection("Fluency", feedback.scores.fluency)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. Pronunciation Analysis */}
          {feedback.pronunciation_feedback && (
            <Card className="rounded-xl border-0 bg-blue-50">
              <CardHeader>
                <span className="font-bold text-blue-700">Pronunciation Analysis</span>
              </CardHeader>
              <CardContent>
                <div className="mb-1">
                  <b>Difficult or mispronounced words: </b>
                  <span>{safeList(feedback.pronunciation_feedback.difficult_words, (w:string,i:number) => <span key={i} className="mr-2">{w}</span>) || "None"}</span>
                </div>
                <div className="mb-1">
                  <b>Phonetic tips & mouth advice:</b>{" "}
                  <span>{feedback.pronunciation_feedback.tips}</span>
                </div>
                <div>
                  <b>Try practicing: </b>
                  <span>{safeList(feedback.pronunciation_feedback.example_words, (w:string,i:number) => <span key={i} className="mr-2">{w}</span>)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. Fluency Feedback */}
          {feedback.fluency_feedback && (
            <Card className="rounded-xl bg-purple-50 border-0">
              <CardHeader>
                <span className="font-bold text-purple-700">Fluency Feedback</span>
              </CardHeader>
              <CardContent>
                <div>
                  <b>Filler words used:</b> {feedback.fluency_feedback.filler_words_count ?? 0}
                </div>
                <div>
                  <b>Unnatural pauses:</b> {feedback.fluency_feedback.unnatural_pauses ?? "None"}
                </div>
                <div>
                  <b>Suggestions for smoother speech:</b> {feedback.fluency_feedback.suggestions}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. Vocabulary Enhancement */}
          {feedback.vocabulary_enhancement && (
            <Card className="rounded-xl bg-yellow-50 border-0">
              <CardHeader>
                <span className="font-bold text-yellow-700">Vocabulary Enhancement</span>
              </CardHeader>
              <CardContent>
                <div>
                  <b>Basic/overused words:</b> {safeList(feedback.vocabulary_enhancement.basic_words, (w:string,i:number) => <span key={i} className="mr-2">{w}</span>)}
                </div>
                {Array.isArray(feedback.vocabulary_enhancement.alternatives) && feedback.vocabulary_enhancement.alternatives.length > 0 ? (
                  <div className="mt-2">
                    <b>Better alternatives & samples:</b>
                    <ul className="list-disc ml-4">
                      {feedback.vocabulary_enhancement.alternatives.map((alt: any, i: number) => (
                        <li key={i}>
                          <b>{alt.word}:</b> {alt.alternatives?.join(", ")}
                          {Array.isArray(alt.samples) && (
                            <>
                              <br /><span className="text-xs text-muted-foreground">{alt.samples.join(" – ")}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* 7. Communication Tips */}
          {feedback.communication_tips && (
            <Card className="rounded-xl bg-primary/10 border-0">
              <CardHeader>
                <span className="font-semibold text-primary">Communication Tips</span>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-6 text-gray-700">
                  {safeList(feedback.communication_tips, (s:string,i:number) => <li key={i}>{s}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 8. Final Summary */}
          {feedback.overall_summary && (
            <Card className="rounded-xl bg-green-50 border-0">
              <CardHeader>
                <span className="font-bold text-green-700">Final Summary</span>
              </CardHeader>
              <CardContent>
                <div>
                  <b>Overall Score:</b> <span className="text-green-700 font-bold">{feedback.overall_summary.score} ({feedback.overall_summary.level})</span>
                </div>
                <div>
                  <b>Recommendation:</b> {feedback.overall_summary.recommendation}
                </div>
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
