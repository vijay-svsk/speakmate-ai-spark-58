
import { useState } from 'react';
import { toast } from "sonner";
import { resetChatHistory, sendMessageToGemini, getLanguageFeedback } from '@/lib/gemini-api';
import { useNavigate } from 'react-router-dom';

export type ConversationEntry = {
  speaker: 'ai' | 'user';
  text: string;
};

export function useConversationState() {
  const [activeTopic, setActiveTopic] = useState("daily_life");
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fluencyScore, setFluencyScore] = useState(60);
  const [vocabularyScore, setVocabularyScore] = useState(70);
  const [grammarScore, setGrammarScore] = useState(65);
  const [hasApiError, setHasApiError] = useState(false);
  
  const navigate = useNavigate();
  
  // Initialize conversation with API key check
  const initializeConversation = async () => {
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey || apiKey.trim() === '') {
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
      setHasApiError(true);
      return false;
    } else {
      console.log("API key found, initializing conversation");
      setHasApiError(false);
      try {
        resetChatHistory(activeTopic);
        const initialGreeting = "Hi, I'm Iyraa, your friendly English tutor. I'm here to help you learn, practice, and fall in love with English — one conversation at a time! What would you like to talk about today?";
        setConversationHistory([{ speaker: 'ai', text: initialGreeting }]);
        setCurrentQuestion(initialGreeting);
        return true;
      } catch (error) {
        console.error("Error initializing conversation:", error);
        setHasApiError(true);
        toast.error("Error initializing conversation. Please check your API key.");
        return false;
      }
    }
  };

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
      return topicGreeting;
    } catch (error) {
      setHasApiError(true);
      toast.error("Failed to change topic. Please try again.");
      console.error("Topic change error:", error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process user's response
  const processUserResponse = async (userResponse: string) => {
    setIsProcessing(true);
    setHasApiError(false);
    
    try {
      // Add user's response to conversation history
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'user', text: userResponse }
      ]);
      
      // Get language feedback
      const languageFeedback = await getLanguageFeedback(userResponse);
      
      // Update scores
      setFluencyScore(languageFeedback.fluencyScore);
      setVocabularyScore(languageFeedback.vocabularyScore);
      setGrammarScore(languageFeedback.grammarScore);
      
      // Add feedback to conversation
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: languageFeedback.feedback }
      ]);
      
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
      
      return { feedback: languageFeedback.feedback, nextQuestion };
    } catch (error) {
      console.error("Error processing response:", error);
      setHasApiError(true);
      toast.error("There was an error processing your response.");
      
      // Fallback response
      const fallbackMessage = "I'm having trouble understanding. Could you try saying that again?";
      setConversationHistory(prev => [
        ...prev, 
        { speaker: 'ai', text: fallbackMessage }
      ]);
      
      return { feedback: "", nextQuestion: fallbackMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    activeTopic,
    conversationHistory,
    currentQuestion,
    isProcessing,
    fluencyScore,
    vocabularyScore,
    grammarScore,
    hasApiError,
    initializeConversation,
    handleTopicChange,
    processUserResponse
  };
}
