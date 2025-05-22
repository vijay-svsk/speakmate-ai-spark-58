
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useSound } from '@/lib/useSound';

export function useSpeechAudio() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { playSound } = useSound();
  
  const { 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    supported 
  } = useSpeechRecognition();

  // Start recording user's speech
  const handleStartRecording = useCallback(() => {
    if (!supported) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    setIsListening(true);
    resetTranscript();
    startListening();
    playSound('keypress');
    toast.info("Listening... Speak now.");
  }, [supported, resetTranscript, startListening, playSound]);

  // Stop recording
  const handleStopRecording = useCallback(() => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      playSound('valid');
      
      if (!transcript) {
        toast.error("I didn't hear anything. Please try again.");
      }
    }
  }, [isListening, stopListening, transcript, playSound]);

  // Handle text-to-speech
  const speakText = useCallback((text: string) => {
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
  }, []);
  
  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    handleStartRecording,
    handleStopRecording,
    speakText,
    stopSpeaking,
    supported
  };
}
