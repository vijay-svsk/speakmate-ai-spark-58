
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useConversationState, ConversationEntry } from '@/hooks/use-conversation-state';
import { useSpeechAudio } from '@/hooks/use-speech-audio';

interface ConversationContextType {
  activeTopic: string;
  conversationHistory: ConversationEntry[];
  currentQuestion: string;
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  isSpeaking: boolean;
  hasApiError: boolean;
  handleTopicChange: (value: string) => Promise<string | null>;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  clearConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
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
    processUserResponse,
    clearConversationHistory
  } = useConversationState();

  const {
    isListening,
    isSpeaking,
    transcript,
    handleStartRecording,
    handleStopRecording: stopRecording,
    speakText,
    stopSpeaking
  } = useSpeechAudio();
  
  // Initialize conversation
  useEffect(() => {
    initializeConversation();
  }, []);
  
  // Define the actual stop recording handler that processes the user response
  const handleStopRecording = async () => {
    stopRecording();
    
    if (transcript) {
      const response = await processUserResponse(transcript);
      
      // Speak the feedback first
      if (response?.feedback) {
        speakText(response.feedback);
      }
      
      // After a short delay, speak the next question
      if (response?.nextQuestion) {
        setTimeout(() => {
          speakText(response.nextQuestion);
        }, 1000);
      }
    }
  };
  
  // Handle topic change with audio
  const handleTopicChangeWithAudio = async (value: string) => {
    const topicGreeting = await handleTopicChange(value);
    if (topicGreeting) {
      speakText(topicGreeting);
    }
    return topicGreeting;
  };

  // Clear conversation and reinitialize
  const clearConversation = () => {
    // Stop any ongoing speech
    stopSpeaking();
    // Clear conversation history
    clearConversationHistory();
    // Reinitialize conversation
    initializeConversation();
  };

  const value = {
    activeTopic,
    conversationHistory,
    currentQuestion,
    isListening,
    isProcessing,
    transcript,
    fluencyScore,
    vocabularyScore,
    grammarScore,
    isSpeaking,
    hasApiError,
    handleTopicChange: handleTopicChangeWithAudio,
    handleStartRecording,
    handleStopRecording,
    speakText,
    stopSpeaking,
    clearConversation
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
