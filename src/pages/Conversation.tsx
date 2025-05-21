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
import { sendMessageToGemini, resetChatHistory, getLanguageFeedback } from '@/lib/gemini-api';

// Topic options for conversation
const CONVERSATION_TOPICS = [
  { value: "daily_life", label: "Daily Life" },
  { value: "travel", label: "Travel" },
  { value: "work", label: "Work & Career" },
  { value: "hobbies", label: "Hobbies & Interests" },
  { value: "food", label: "Food & Dining" },
  { value: "technology", label: "Technology" }
];

const ConversationAI = () => {
  const [activeTopic, setActiveTopic] = useState("daily_life");
  const [conversationHistory, setConversationHistory] = useState<{ speaker: 'ai' | 'user', text: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    const initConversation = async () => {
      resetChatHistory(activeTopic);
      const initialGreeting = "Hello! I'm your AI conversation partner. Let's practice speaking English together. What would you like to talk about today?";
      setConversationHistory([{ speaker: 'ai', text: initialGreeting }]);
      setCurrentQuestion(initialGreeting);
    };
    
    initConversation();
  }, []);

  // Handle topic change
  const handleTopicChange = async (value: string) => {
    setActiveTopic(value);
    setIsProcessing(true);
    
    try {
      resetChatHistory(value);
      const topicGreeting = await sendMessageToGemini(`Let's talk about ${value.replace('_', ' ')}. Ask me a question about this topic.`, value);
      
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: topicGreeting }
      ]);
      setCurrentQuestion(topicGreeting);
      toast.success(`Topic changed to ${value.replace('_', ' ')}`);
    } catch (error) {
      toast.error("Failed to change topic. Please try again.");
      console.error("Topic change error:", error);
    } finally {
      setIsProcessing(false);
    }
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
        processUserResponse(transcript);
      } else {
        toast.error("I didn't hear anything. Please try again.");
      }
    }
  };

  // Process user's response and generate AI feedback
  const processUserResponse = async (userResponse: string) => {
    setIsProcessing(true);
    
    try {
      // Get language feedback
      const languageFeedback = await getLanguageFeedback(userResponse);
      
      // Update scores
      setFluencyScore(languageFeedback.fluencyScore);
      setVocabularyScore(languageFeedback.vocabularyScore);
      setGrammarScore(languageFeedback.grammarScore);
      setFeedback(languageFeedback.feedback);
      
      // Add feedback to conversation
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: languageFeedback.feedback }
      ]);
      
      // Generate next question
      const nextQuestion = await sendMessageToGemini(userResponse, activeTopic);
      
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: nextQuestion }
      ]);
      setCurrentQuestion(nextQuestion);
    } catch (error) {
      console.error("Error processing response:", error);
      toast.error("There was an error processing your response.");
      
      // Fallback response
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: "I'm having trouble understanding. Could you try saying that again?" }
      ]);
    } finally {
      setIsProcessing(false);
    }
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
                <Select value={activeTopic} onValueChange={handleTopicChange} disabled={isProcessing || isListening}>
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
                  {isProcessing && (
                    <div className="flex mb-4 justify-start">
                      <div className="flex max-w-[80%] flex-row">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full mr-2 bg-primary text-primary-foreground">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="animate-pulse">Thinking</div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                        disabled={isProcessing}
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
