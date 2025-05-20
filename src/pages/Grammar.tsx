
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Book, Mic, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, ResponsiveContainer } from "recharts";

// This would be replaced with a proper API call in a real implementation
const analyzeGrammar = (text: string) => {
  // Placeholder for grammar analysis
  const errors = [
    {
      original: "She do not likes apples",
      corrected: "She does not like apples",
      explanation: "\"Do\" changes to \"does\" for third-person singular. The verb \"like\" stays in base form after \"does\".",
      type: "subject-verb agreement"
    },
    {
      original: "I has been there",
      corrected: "I have been there",
      explanation: "Use \"have\" with I, you, we, they and plural nouns. Use \"has\" with he, she, it and singular nouns.",
      type: "verb form"
    }
  ];
  
  // Return some mock analysis with some of the user's text
  return {
    score: Math.floor(Math.random() * 30) + 70,
    errors: text.length > 10 ? errors : [],
    readabilityScore: Math.floor(Math.random() * 50) + 50,
    suggestion: "Try to use more varied sentence structures to make your writing more engaging."
  };
};

// Mock data for the radar chart
const grammarData = [
  { category: "Grammar", score: 80, fullMark: 100 },
  { category: "Vocabulary", score: 70, fullMark: 100 },
  { category: "Coherence", score: 85, fullMark: 100 },
  { category: "Style", score: 65, fullMark: 100 },
  { category: "Punctuation", score: 90, fullMark: 100 },
];

// Daily challenge suggestions
const dailyChallenges = [
  "Write a paragraph using 5 different tenses.",
  "Compose three sentences using passive voice correctly.",
  "Write a short story without using any forms of 'to be'.",
  "Create five questions using different question words.",
  "Write instructions for a simple task using imperative form."
];

const Grammar = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);
  const { toast } = useToast();
  const { transcript, startListening, stopListening, isListening, resetTranscript, supported } = useSpeechRecognition();

  React.useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulating API call delay
    setTimeout(() => {
      const result = analyzeGrammar(text);
      setAnalysis(result);
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: `Your grammar score: ${result.score}/100`,
      });
    }, 1500);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
      toast({
        title: "Listening...",
        description: "Speak now. Your speech will be converted to text."
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-bold font-playfair text-primary mb-2">Grammar Clinic</h1>
              <p className="text-gray-600">Your personal AI grammar coach</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 text-primary" />
                    Grammar Input
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Textarea 
                      placeholder="Type or paste your text here..."
                      className="min-h-[150px]"
                      value={text}
                      onChange={handleTextChange}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                        {isAnalyzing ? "Analyzing..." : "Analyze Grammar"}
                      </Button>
                      {supported && (
                        <Button
                          variant="outline"
                          onClick={handleMicClick}
                          className={isListening ? "bg-red-100 hover:bg-red-200" : ""}
                        >
                          <Mic className="mr-2 h-4 w-4" />
                          {isListening ? "Stop" : "Speak"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 text-primary" />
                    Skills Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={70} data={grammarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar 
                          name="Score" 
                          dataKey="score" 
                          stroke="#9b87f5" 
                          fill="#9b87f5" 
                          fillOpacity={0.5} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {analysis && (
              <Card className="mb-8 border-t-4 border-primary">
                <CardHeader>
                  <CardTitle>Grammar Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Score: {analysis.score}/100</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>

                  {analysis.errors.length > 0 ? (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Grammar Issues Found:</h3>
                      {analysis.errors.map((error: any, index: number) => (
                        <Alert key={index} className="mb-3">
                          <AlertTitle className="font-medium">{error.type}</AlertTitle>
                          <AlertDescription>
                            <p className="mb-1"><strong>Original:</strong> {error.original}</p>
                            <p className="mb-1"><strong>Corrected:</strong> {error.corrected}</p>
                            <p><strong>Explanation:</strong> {error.explanation}</p>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <Alert className="mb-4">
                      <AlertTitle className="font-medium">No major grammar issues found</AlertTitle>
                      <AlertDescription>Great job! Your text looks good grammatically.</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Suggestions:</h3>
                    <p>{analysis.suggestion}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Daily Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{dailyChallenge}</p>
                <Button variant="outline" onClick={() => setDailyChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)])}>
                  Get New Challenge
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Grammar;
