
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { sendMessageToGemini, resetChatHistory, getLanguageFeedback } from '@/lib/gemini-api';
import ConversationContainer from '@/components/conversation/ConversationContainer';

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <ConversationContainer
          activeTopic={activeTopic}
          conversationHistory={conversationHistory}
          currentQuestion={currentQuestion}
          isListening={isListening}
          isProcessing={isProcessing}
          transcript={transcript}
          fluencyScore={fluencyScore}
          vocabularyScore={vocabularyScore}
          grammarScore={grammarScore}
          onTopicChange={handleTopicChange}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
      </div>
    </SidebarProvider>
  );
};

export default ConversationAI;
