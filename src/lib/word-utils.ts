
import { commonFiveLetterWords } from './word-lists/common-words';
import { validFiveLetterWords } from './word-lists/valid-words';

// Get a random word from the list of common words
export const getRandomWord = (): string => {
  const index = Math.floor(Math.random() * commonFiveLetterWords.length);
  return commonFiveLetterWords[index];
};

// Check if a word is valid (in our list of valid words)
export const isValidWord = (word: string): boolean => {
  return validFiveLetterWords.includes(word.toLowerCase());
};

// Check letter status in a word
type LetterStatus = 'correct' | 'present' | 'absent';

export const checkWordGuess = (guess: string, targetWord: string): LetterStatus[] => {
  // Convert both words to lowercase
  const normalizedGuess = guess.toLowerCase();
  const normalizedTarget = targetWord.toLowerCase();
  
  // Track letters in the target word
  const targetLetters: Record<string, number> = {};
  for (const letter of normalizedTarget) {
    targetLetters[letter] = (targetLetters[letter] || 0) + 1;
  }
  
  // First pass: mark correct letters
  const result: LetterStatus[] = Array(normalizedGuess.length).fill('absent');
  const usedIndices = new Set<number>();
  
  // Mark correct positions first
  for (let i = 0; i < normalizedGuess.length; i++) {
    const guessLetter = normalizedGuess[i];
    if (guessLetter === normalizedTarget[i]) {
      result[i] = 'correct';
      targetLetters[guessLetter] -= 1;
      usedIndices.add(i);
    }
  }
  
  // Mark present letters next, but only if we have occurrences left
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (usedIndices.has(i)) continue;
    
    const guessLetter = normalizedGuess[i];
    if (targetLetters[guessLetter] > 0) {
      result[i] = 'present';
      targetLetters[guessLetter] -= 1;
    }
  }
  
  return result;
};

// Generate a keyboard map based on guesses
export const generateKeyboardStatus = (
  guesses: string[], 
  statuses: LetterStatus[][]
): Record<string, LetterStatus> => {
  const keyboardStatus: Record<string, LetterStatus> = {};
  
  // Flatten all guesses and their statuses
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i].toLowerCase();
    const status = statuses[i];
    
    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      const currentStatus = status[j];
      
      // Only update if the new status is better than the existing one
      // correct > present > absent
      if (currentStatus === 'correct') {
        keyboardStatus[letter] = 'correct';
      } else if (currentStatus === 'present' && keyboardStatus[letter] !== 'correct') {
        keyboardStatus[letter] = 'present';
      } else if (!keyboardStatus[letter]) {
        keyboardStatus[letter] = currentStatus;
      }
    }
  }
  
  return keyboardStatus;
};
