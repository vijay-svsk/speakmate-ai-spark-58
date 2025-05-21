
import React, { useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { MessageSquare, User, Mic, MicOff, AlertOctagon, Volume, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ConversationEntry = {
  speaker: 'ai' | 'user';
  text: string;
};

interface ConversationDisplayProps {
  conversationHistory: ConversationEntry[];
  currentQuestion: string;
  isProcessing: boolean;
  isListening: boolean;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpeakMessage?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  hasApiError?: boolean;
}

const ConversationDisplay = ({
  conversationHistory,
  currentQuestion,
  isProcessing,
  isListening,
  transcript,
  onStartRecording,
  onStopRecording,
  onSpeakMessage,
  isSpeaking,
  onStopSpeaking,
  hasApiError
}: ConversationDisplayProps) => {
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat with Iyraa</CardTitle>
        <CardDescription>Practice your English with Iyraa, your friendly AI language tutor</CardDescription>
      </CardHeader>
      <CardContent>
        {hasApiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertOctagon className="h-4 w-4" />
            <AlertDescription>
              There was an error connecting to the AI. Please try again or choose a different topic.
            </AlertDescription>
          </Alert>
        )}
        <div className="h-96 overflow-y-auto border rounded-lg p-4">
          {conversationHistory.map((entry, index) => (
            <div key={index} className={`flex mb-4 ${entry.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex max-w-[80%] ${entry.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${
                  entry.speaker === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {entry.speaker === 'ai' ? <MessageSquare className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`p-3 rounded-lg relative ${
                  entry.speaker === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                }`}>
                  {entry.text}
                  {entry.speaker === 'ai' && onSpeakMessage && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 absolute -top-3 -right-3 rounded-full bg-white shadow-sm hover:bg-gray-100"
                      onClick={() => entry.text && onSpeakMessage(entry.text)}
                    >
                      <Volume className="h-3 w-3" />
                    </Button>
                  )}
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
        <RecordingControls
          isListening={isListening}
          isProcessing={isProcessing}
          currentQuestion={currentQuestion}
          transcript={transcript}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          isSpeaking={isSpeaking}
          onStopSpeaking={onStopSpeaking}
        />
      </CardFooter>
    </Card>
  );
};

// Internal component for recording controls
const RecordingControls = ({
  isListening,
  isProcessing,
  currentQuestion,
  transcript,
  onStartRecording,
  onStopRecording,
  isSpeaking,
  onStopSpeaking
}: {
  isListening: boolean;
  isProcessing: boolean;
  currentQuestion: string;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mb-4">
        <div className="text-lg font-medium flex items-center gap-2">
          {isListening ? 'Listening...' : currentQuestion}
          {isSpeaking && (
            <Button 
              onClick={onStopSpeaking} 
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <VolumeX className="h-4 w-4 mr-1" /> Stop Audio
            </Button>
          )}
        </div>
        <Button
          onClick={isListening ? onStopRecording : onStartRecording}
          variant={isListening ? "destructive" : "default"}
          className="rounded-full h-12 w-12 p-0"
          disabled={isProcessing}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </div>
      {isListening && (
        <div className="w-full text-center font-medium">
          {transcript ? transcript : 'Waiting for you to speak...'}
        </div>
      )}
    </>
  );
};

export default ConversationDisplay;
