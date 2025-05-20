
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Mic, MicOff, MessageSquare, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

// Topic options for conversation
const CONVERSATION_TOPICS = [
  { value: "daily_life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work & Career" },
  { value: "hobbies", label: "Hobbies & Interests" },
  { value: "food", label: "Food & Dining" },
  { value: "technology", label: "Technology" }
];

// Mock AI responses based on topics
const AI_RESPONSES = {
  daily_life: [
    "Tell me about your daily routine.",
    "What did you do yesterday?",
    "Do you enjoy weekdays or weekends more? Why?",
    "What's the best part of your day usually?",
    "How do you usually spend your evenings?",
    "Do you prefer morning or evening? Why?"
  ],
  travel: [
    "Where was your favorite vacation?",
    "What country would you like to visit next?",
    "Do you prefer beaches or mountains?",
    "What's your preferred method of transportation when traveling?",
    "Tell me about a memorable travel experience you've had.",
    "What's one place you'd like to visit but haven't yet?"
  ],
  work: [
    "What do you do for work?",
    "What's your dream job?",
    "What skills are important in your profession?",
    "How has your industry changed recently?",
    "What do you enjoy most about your job?",
    "What challenges do you face in your work?"
  ],
  hobbies: [
    "What do you enjoy doing in your free time?",
    "Tell me about your favorite hobby.",
    "How long have you been interested in this hobby?",
    "Have you picked up any new hobbies recently?",
    "What skills have you developed through your hobbies?",
    "What hobby would you like to try in the future?"
  ],
  food: [
    "What's your favorite cuisine?",
    "Do you enjoy cooking? What's your specialty?",
    "What's a traditional dish from your country?",
    "Have you tried any interesting new foods lately?",
    "What's your favorite restaurant?",
    "Do you prefer home-cooked meals or eating out?"
  ],
  technology: [
    "What tech gadget do you use the most?",
    "How has technology changed your daily life?",
    "What's your opinion on artificial intelligence?",
    "What technological advances are you excited about?",
    "Do you think we rely too much on technology?",
    "What's one piece of technology you couldn't live without?"
  ]
};

// Mock feedback based on speech recognition results
const FEEDBACK_TEMPLATES = [
  "Great job! Your pronunciation was clear.",
  "I noticed you said '{word}'. Consider using '{alternative}' for more natural speech.",
  "Your fluency is improving! Keep practicing.",
  "Try to speak a bit more slowly for better clarity.",
  "You used excellent vocabulary in your response.",
  "Consider using more complex sentences to challenge yourself."
];

const ConversationAI = () => {
  const [activeTopic, setActiveTopic] = useState("daily_life");
  const [conversationHistory, setConversationHistory] = useState<{ speaker: 'ai' | 'user', text: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [fluencyScore, setFluencyScore] = useState(60);
  const [vocabularyScore, setVocabularyScore] = useState(70);
  const [grammarScore, setGrammarScore] = useState(65);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    supported 
  } = useSpeechRecognition();

  // Initialize conversation with a greeting
  useEffect(() => {
    const initialGreeting = "Hello! I'm your AI conversation partner. Let's practice speaking English together. What would you like to talk about today?";
    setConversationHistory([{ speaker: 'ai', text: initialGreeting }]);
    setCurrentQuestion(initialGreeting);
  }, []);

  // Handle topic change
  const handleTopicChange = (value: string) => {
    setActiveTopic(value);
    const topicGreeting = `Great! Let's talk about ${value.replace('_', ' ')}. `;
    const firstQuestion = AI_RESPONSES[value as keyof typeof AI_RESPONSES][0];
    const fullMessage = topicGreeting + firstQuestion;
    
    setConversationHistory(prev => [
      ...prev, 
      { speaker: 'ai', text: fullMessage }
    ]);
    setCurrentQuestion(fullMessage);
    toast.success(`Topic changed to ${value.replace('_', ' ')}`);
  };

  // Start recording user's speech
  const handleStartRecording = () => {
    if (!supported) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    setIsListening(true);
    resetTranscript();
    startListening();
    toast.info("Listening... Speak now.");
  };

  // Stop recording and process the response
  const handleStopRecording = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      
      if (transcript) {
        // Add user's response to conversation history
        setConversationHistory(prev => [
          ...prev, 
          { speaker: 'user', text: transcript }
        ]);
        
        // Generate AI feedback and next question
        setTimeout(() => {
          processUserResponse(transcript);
        }, 1000);
      } else {
        toast.error("I didn't hear anything. Please try again.");
      }
    }
  };

  // Process user's response and generate AI feedback
  const processUserResponse = (userResponse: string) => {
    // Generate simple feedback
    const words = userResponse.split(' ').filter(word => word.length > 3);
    const randomWord = words[Math.floor(Math.random() * words.length)] || 'good';
    const alternatives = ['excellent', 'great', 'wonderful', 'fantastic'];
    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
    
    const feedbackTemplate = FEEDBACK_TEMPLATES[Math.floor(Math.random() * FEEDBACK_TEMPLATES.length)];
    const generatedFeedback = feedbackTemplate
      .replace('{word}', randomWord)
      .replace('{alternative}', randomAlternative);
    
    setFeedback(generatedFeedback);
    
    // Update scores randomly to simulate analysis
    setFluencyScore(Math.min(100, fluencyScore + Math.floor(Math.random() * 10) - 3));
    setVocabularyScore(Math.min(100, vocabularyScore + Math.floor(Math.random() * 10) - 3));
    setGrammarScore(Math.min(100, grammarScore + Math.floor(Math.random() * 10) - 3));
    
    // Add feedback to conversation
    setConversationHistory(prev => [
      ...prev, 
      { speaker: 'ai', text: generatedFeedback }
    ]);
    
    // Generate next question
    const questions = AI_RESPONSES[activeTopic as keyof typeof AI_RESPONSES];
    const nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    setTimeout(() => {
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: nextQuestion }
      ]);
      setCurrentQuestion(nextQuestion);
    }, 1500);
  };

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-primary">Conversation AI</h1>
              <div className="flex items-center gap-2">
                <Label htmlFor="topic" className="whitespace-nowrap">Topic:</Label>
                <Select value={activeTopic} onValueChange={handleTopicChange}>
                  <SelectTrigger id="topic" className="w-40">
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONVERSATION_TOPICS.map((topic) => (
                      <SelectItem key={topic.value} value={topic.value}>{topic.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conversation Display */}
            <Card>
              <CardHeader>
                <CardTitle>Active Conversation</CardTitle>
                <CardDescription>Practice your English speaking with an AI conversation partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto border rounded-lg p-4">
                  {conversationHistory.map((entry, index) => (
                    <div key={index} className={`flex mb-4 ${entry.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`flex max-w-[80%] ${entry.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${
                          entry.speaker === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {entry.speaker === 'ai' ? <MessageSquare className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          entry.speaker === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                        }`}>
                          {entry.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={historyEndRef} />
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 flex-col">
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="text-lg font-medium">
                    {isListening ? 'Listening...' : currentQuestion}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={isListening ? handleStopRecording : handleStartRecording}
                        variant={isListening ? "destructive" : "default"}
                        className="rounded-full h-12 w-12 p-0"
                      >
                        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isListening ? 'Stop Recording' : 'Start Recording'}
                    </TooltipContent>
                  </Tooltip>
                </div>
                {isListening && (
                  <div className="w-full text-center font-medium">
                    {transcript ? transcript : 'Waiting for you to speak...'}
                  </div>
                )}
              </CardFooter>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Speaking Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Fluency</Label>
                      <span className="text-sm text-muted-foreground">{fluencyScore}%</span>
                    </div>
                    <Progress value={fluencyScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Vocabulary</Label>
                      <span className="text-sm text-muted-foreground">{vocabularyScore}%</span>
                    </div>
                    <Progress value={vocabularyScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Grammar</Label>
                      <span className="text-sm text-muted-foreground">{grammarScore}%</span>
                    </div>
                    <Progress value={grammarScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ConversationAI;
