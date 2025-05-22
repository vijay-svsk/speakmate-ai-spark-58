
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
}

export const useSpeechRecognition = (): SpeechRecognitionResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;
        setTranscript(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
      setSupported(true);
    } else {
      setSupported(false);
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
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        
        // If recognition is already started, stop it first then restart
        if (error instanceof DOMException && error.message.includes('already started')) {
          try {
            recognition.stop();
            // Small timeout to ensure recognition has fully stopped
            setTimeout(() => {
              recognition.start();
              setIsListening(true);
            }, 100);
          } catch (stopError) {
            console.error('Error stopping and restarting recognition:', stopError);
          }
        }
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    supported,
  };
};
