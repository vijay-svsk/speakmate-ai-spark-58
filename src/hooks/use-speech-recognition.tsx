
import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (event: any) => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  resetTranscript: () => void;
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  supported: boolean;
  lastError: string | null;
}

export const useSpeechRecognition = (): SpeechRecognitionResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [supported, setSupported] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [restartAttempts, setRestartAttempts] = useState(0);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;
      recognition.continuous = true;  // Enable continuous recognition
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        if (result && result[0]) {
          const transcript = result[0].transcript;
          setTranscript(transcript);
          setLastError(null); // Clear any previous errors on successful results
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setLastError(`Recognition error: ${event.error || 'unknown'}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        // Only change state if we didn't initiate a restart
        if (restartAttempts === 0) {
          setIsListening(false);
        }
        setRestartAttempts(0);
      };
      
      setRecognition(recognition);
      setSupported(true);
    } else {
      setSupported(false);
      setLastError("Speech recognition not supported in this browser");
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition during cleanup:', error);
        }
      }
    };
  }, [restartAttempts]);

  const startListening = useCallback(() => {
    if (!recognition) {
      setLastError("Speech recognition not available");
      return;
    }

    if (isListening) {
      // Already listening, no need to start again
      return;
    }

    setTranscript('');
    setLastError(null);
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      
      // Handle the case where recognition has already started
      if (error instanceof DOMException && error.message.includes('already started')) {
        try {
          // Force stop and restart with a small delay
          recognition.stop();
          setRestartAttempts(prev => prev + 1);
          
          setTimeout(() => {
            try {
              recognition.start();
              setIsListening(true);
            } catch (innerError) {
              console.error('Error restarting recognition:', innerError);
              setLastError("Failed to restart speech recognition");
            }
          }, 200);
        } catch (stopError) {
          console.error('Error stopping recognition:', stopError);
          setLastError("Failed to reset speech recognition");
        }
      } else {
        setLastError(error.message || "Failed to start speech recognition");
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (!recognition) {
      return;
    }

    if (!isListening) {
      // Already stopped
      return;
    }
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (error: any) {
      console.error('Error stopping speech recognition:', error);
      setLastError(error.message || "Failed to stop speech recognition");
      
      // Force recognition state to be stopped even if the API call failed
      setIsListening(false);
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setLastError(null);
  }, []);

  return {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    supported,
    lastError
  };
};
