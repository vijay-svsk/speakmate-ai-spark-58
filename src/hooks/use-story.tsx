
import { useState, useCallback } from 'react';

// This is a placeholder function that simulates fetching from Gemini API
// In a real application, you would replace this with actual API calls
const fetchStoryFromGemini = async (difficulty: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Sample stories based on difficulty
  const stories = {
    beginner: "Once upon a time, there was a little cat. The cat liked to play. It jumped and ran all day. The cat was happy and made friends with a dog. They played together in the park.",
    intermediate: "Sarah woke up early to catch the morning train. She had an important meeting at work and couldn't afford to be late. As she hurried down the stairs, she noticed that it was raining heavily outside. Unfortunately, she had forgotten her umbrella at the office the day before.",
    advanced: "The ancient manuscript contained peculiar symbols that had confounded scholars for decades. Professor Harrington believed he was finally on the verge of deciphering the mysterious text, which purportedly revealed the location of a long-lost civilization. His colleagues remained skeptical, citing insufficient evidence for his extraordinary claims about the document's origins."
  };
  
  return stories[difficulty as keyof typeof stories] || stories.beginner;
};

export const useStory = () => {
  const [story, setStory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const generateStory = useCallback(async (difficulty: string) => {
    setLoading(true);
    setError(false);
    
    try {
      const newStory = await fetchStoryFromGemini(difficulty);
      setStory(newStory);
    } catch (err) {
      console.error('Error fetching story:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    story,
    loading,
    error,
    generateStory
  };
};
