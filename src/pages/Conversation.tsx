
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { sendMessageToGemini, resetChatHistory, getLanguageFeedback } from '@/lib/gemini-api';
import ConversationContainer from '@/components/conversation/ConversationContainer';
import { useNavigate } from 'react-router-dom';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);
  
  const navigate = useNavigate();
  
  const { 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    supported 
  } = useSpeechRecognition();

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey || apiKey.trim() === '') {
      toast.warning(
        "No API key found. Please set your Gemini API key in Settings",
        {
          action: {
            label: "Go to Settings",
            onClick: () => navigate('/settings')
          },
          duration: 10000, // Increased duration for better visibility
        }
      );
      setHasApiError(true);
    } else {
      console.log("API key found, initializing conversation");
      setHasApiError(false);
      // Initialize conversation with a greeting only if API key is present
      const initConversation = async () => {
        try {
          resetChatHistory(activeTopic);
          const initialGreeting = "Hi, I'm Iyraa, your friendly English tutor. I'm here to help you learn, practice, and fall in love with English — one conversation at a time! What would you like to talk about today?";
          setConversationHistory([{ speaker: 'ai', text: initialGreeting }]);
          setCurrentQuestion(initialGreeting);
        } catch (error) {
          console.error("Error initializing conversation:", error);
          setHasApiError(true);
          toast.error("Error initializing conversation. Please check your API key.");
        }
      };
      
      initConversation();
    }
  }, [navigate, activeTopic]);

  // Handle topic change
  const handleTopicChange = async (value: string) => {
    setActiveTopic(value);
    setIsProcessing(true);
    setHasApiError(false);
    
    try {
      resetChatHistory(value);
      const topicGreeting = await sendMessageToGemini(`Let's talk about ${value.replace('_', ' ')}. Ask me a question about this topic.`, value);
      
      if (topicGreeting.includes("Sorry, I encountered an error")) {
        setHasApiError(true);
        toast.error("Error connecting to the conversation AI");
      }
      
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: topicGreeting }
      ]);
      setCurrentQuestion(topicGreeting);
      toast.success(`Topic changed to ${value.replace('_', ' ')}`);
      
      // Speak the new topic greeting
      speakText(topicGreeting);
    } catch (error) {
      setHasApiError(true);
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
    setHasApiError(false);
    
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
      
      // Speak the feedback
      speakText(languageFeedback.feedback);
      
      // Generate next question
      const nextQuestion = await sendMessageToGemini(userResponse, activeTopic);
      
      if (nextQuestion.includes("Sorry, I encountered an error")) {
        setHasApiError(true);
        toast.error("Error connecting to the conversation AI");
      }
      
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: nextQuestion }
      ]);
      setCurrentQuestion(nextQuestion);
      
      // After a short delay, speak the next question
      setTimeout(() => {
        speakText(nextQuestion);
      }, 1000);
    } catch (error) {
      console.error("Error processing response:", error);
      setHasApiError(true);
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
  
  // Handle text-to-speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error("Text-to-speech is not supported in your browser.");
      return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice to a female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 0.9; // Slightly slower for language learning
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error("Error speaking text");
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
          onSpeakMessage={speakText}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
          hasApiError={hasApiError}
        />
      </div>
    </SidebarProvider>
  );
};

export default ConversationAI;
