
import { useState, useEffect, useCallback, useRef } from 'react';

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
  
  // Refs to maintain state during recognition lifecycle
  const finalTranscriptRef = useRef('');
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const isActivelyListeningRef = useRef(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition() as SpeechRecognition;
      recognition.continuous = true;  // Enable continuous recognition
      recognition.interimResults = true; // Get interim results to handle pauses
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = finalTranscriptRef.current;
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
            lastSpeechTimeRef.current = Date.now(); // Reset silence timer
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        // Update refs and state
        finalTranscriptRef.current = finalTranscript;
        const fullTranscript = (finalTranscript + interimTranscript).trim();
        setTranscript(fullTranscript);
        setLastError(null);
        
        // Reset silence timeout since we got speech
        resetSilenceTimeout();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        
        // Don't stop on network errors or no-speech errors, just log them
        if (event.error === 'network' || event.error === 'no-speech') {
          console.log('Recoverable speech recognition error:', event.error);
          return;
        }
        
        setLastError(`Recognition error: ${event.error || 'unknown'}`);
        
        // Only stop on critical errors
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsListening(false);
          isActivelyListeningRef.current = false;
        }
      };
      
      recognition.onend = () => {
        // Only restart if we're still supposed to be listening
        if (isActivelyListeningRef.current) {
          try {
            // Small delay before restarting to avoid rapid restart loops
            setTimeout(() => {
              if (isActivelyListeningRef.current) {
                recognition.start();
              }
            }, 100);
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        } else {
          setIsListening(false);
        }
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
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Function to reset the 2-minute silence timeout
  const resetSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Set 2-minute (120000ms) silence timeout
    silenceTimeoutRef.current = setTimeout(() => {
      console.log('2 minutes of silence detected, stopping recognition');
      if (isActivelyListeningRef.current) {
        stopListening();
      }
    }, 120000); // 2 minutes
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setLastError("Speech recognition not available");
      return;
    }

    if (isActivelyListeningRef.current) {
      // Already listening, no need to start again
      return;
    }

    // Don't reset transcript here - maintain continuous transcript
    setLastError(null);
    isActivelyListeningRef.current = true;
    lastSpeechTimeRef.current = Date.now();
    
    try {
      recognition.start();
      setIsListening(true);
      resetSilenceTimeout(); // Start the silence timeout
    } catch (error: any) {
      console.error('Error starting speech recognition:', error);
      
      // Handle the case where recognition has already started
      if (error instanceof DOMException && error.message.includes('already started')) {
        setIsListening(true);
        resetSilenceTimeout();
      } else {
        setLastError(error.message || "Failed to start speech recognition");
        isActivelyListeningRef.current = false;
      }
    }
  }, [recognition, resetSilenceTimeout]);

  const stopListening = useCallback(() => {
    if (!recognition) {
      return;
    }

    isActivelyListeningRef.current = false;
    
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
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
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    finalTranscriptRef.current = '';
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
