
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ConversationDisplay from './ConversationDisplay';
import PerformanceMetrics from './PerformanceMetrics';
import TopicSelector from './TopicSelector';

interface ConversationContainerProps {
  activeTopic: string;
  conversationHistory: { speaker: 'ai' | 'user'; text: string }[];
  currentQuestion: string;
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  onTopicChange: (value: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpeakMessage?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  hasApiError?: boolean;
}

const ConversationContainer = ({
  activeTopic,
  conversationHistory,
  currentQuestion,
  isListening,
  isProcessing,
  transcript,
  fluencyScore,
  vocabularyScore,
  grammarScore,
  onTopicChange,
  onStartRecording,
  onStopRecording,
  onSpeakMessage,
  isSpeaking,
  onStopSpeaking,
  hasApiError
}: ConversationContainerProps) => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Conversation AI</h1>
          <TopicSelector 
            activeTopic={activeTopic}
            onTopicChange={onTopicChange}
            disabled={isProcessing || isListening}
          />
        </div>

        <Tooltip>
          <TooltipTrigger>
            <ConversationDisplay 
              conversationHistory={conversationHistory}
              currentQuestion={currentQuestion}
              isProcessing={isProcessing}
              isListening={isListening}
              transcript={transcript}
              onStartRecording={onStartRecording}
              onStopRecording={onStopRecording}
              onSpeakMessage={onSpeakMessage}
              isSpeaking={isSpeaking}
              onStopSpeaking={onStopSpeaking}
              hasApiError={hasApiError}
            />
          </TooltipTrigger>
          <TooltipContent>
            {isListening ? 'Stop Recording' : 'Start Recording'}
          </TooltipContent>
        </Tooltip>

        <PerformanceMetrics
          fluencyScore={fluencyScore}
          vocabularyScore={vocabularyScore}
          grammarScore={grammarScore}
        />
      </div>
    </div>
  );
};

export default ConversationContainer;
