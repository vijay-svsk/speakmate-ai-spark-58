
import { useCallback, useEffect, useState } from 'react';

// A simplified sound hook until we add Howler.js
export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved ? JSON.parse(saved) : false;
  });

  // Save mute preference to localStorage
  useEffect(() => {
    localStorage.setItem('soundMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playSound = useCallback((type: 'keypress' | 'valid' | 'invalid' | 'win' | 'lose') => {
    if (isMuted) return;
    
    // Simple audio feedback without loading Howler yet
    // In a production app, we'd use preloaded Howler sounds
    const audioFiles = {
      keypress: new Audio('/sounds/key-press.mp3'),
      valid: new Audio('/sounds/valid-word.mp3'), 
      invalid: new Audio('/sounds/invalid-word.mp3'),
      win: new Audio('/sounds/win-game.mp3'),
      lose: new Audio('/sounds/lose-game.mp3')
    };
    
    // Fallback to these beep sounds if the real sounds aren't available
    const audioFrequencies = {
      keypress: 600,
      valid: 800,
      invalid: 300,
      win: 1000,
      lose: 200
    };
    
    try {
      // Try to play the audio file
      audioFiles[type].play().catch(() => {
        // If audio file loading fails, generate a simple beep sound
        if (window.AudioContext || window.webkitAudioContext) {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(audioFrequencies[type], audioContext.currentTime);
          
          const gainNode = audioContext.createGain();
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [isMuted]);

  return { isMuted, toggleMute, playSound };
}
