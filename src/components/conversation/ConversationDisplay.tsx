
import React, { useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { MessageSquare, User, Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
}

const ConversationDisplay = ({
  conversationHistory,
  currentQuestion,
  isProcessing,
  isListening,
  transcript,
  onStartRecording,
  onStopRecording
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
        <RecordingControls
          isListening={isListening}
          isProcessing={isProcessing}
          currentQuestion={currentQuestion}
          transcript={transcript}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
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
  onStopRecording
}: {
  isListening: boolean;
  isProcessing: boolean;
  currentQuestion: string;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) => {
  return (
    <>
      <div className="flex items-center justify-between w-full mb-4">
        <div className="text-lg font-medium">
          {isListening ? 'Listening...' : currentQuestion}
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
