
import { GoogleGenerativeAI } from "@google/generative-ai";

// Default API key (will be overridden by user-provided key if available)
const DEFAULT_API_KEY = "AIzaSyBcZENeo3gkU6YVQYKCYf8EhOltT87q4es";

// Initialize with a function to get the API key (from localStorage if available)
const getApiKey = (): string => {
  // Always get the freshest key from localStorage (no caching)
  const userProvidedKey = localStorage.getItem("gemini-api-key");
  return userProvidedKey && userProvidedKey.trim().length > 0 ? userProvidedKey.trim() : DEFAULT_API_KEY;
};

// Create a function to get a fresh instance of the API with the current key
const getGenAIInstance = (): GoogleGenerativeAI => {
  return new GoogleGenerativeAI(getApiKey());
};

// Store chat instance for conversation continuity
let chatInstance;

// Model configuration with fallbacks
const MODELS = {
  PRIMARY: "gemini-1.0-pro", // Use 1.0 as primary since it has higher quota limits
  FALLBACK: "gemini-pro",    // Legacy model name as fallback
};

// Reset the chat history for a new conversation
export const resetChatHistory = (topic: string): void => {
  chatInstance = null;
  
  // The system prompt will be sent as the first message after initializing the chat
  console.log(`Chat reset with topic: ${topic}`);
};

// Send message to Gemini and get response
export const sendMessageToGemini = async (userMessage: string, topic: string): Promise<string> => {
  try {
    // Get fresh instance with current API key
    const genAI = getGenAIInstance();
    
    // Try with primary model first
    let currentModel = MODELS.PRIMARY;
    let model = genAI.getGenerativeModel({ model: currentModel });
    
    // Initialize chat if it doesn't exist
    if (!chatInstance) {
      // Create a system prompt based on topic
      const systemPrompt = `You are an AI English conversation partner helping someone practice their English skills. 
      The current conversation topic is: ${topic}. 
      Be supportive, conversational, and provide gentle feedback on grammar or vocabulary when appropriate. 
      Keep your responses concise (2-3 sentences) and engaging.`;
      
      // Start a new chat
      chatInstance = model.startChat({
        history: [
          {
            role: "user",
            parts: `System instruction (please follow these guidelines): ${systemPrompt}`
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      });
    }
    
    try {
      // Send the message using the chat instance
      const result = await chatInstance.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();
      
      return responseText;
    } catch (error: any) {
      console.error(`Error with model ${currentModel}:`, error);
      
      // If we get a 429 error (quota exceeded) and we're using the primary model, try the fallback
      if (error.message && error.message.includes("429") && currentModel === MODELS.PRIMARY) {
        console.log("Trying fallback model due to quota limits...");
        
        // Reset chat instance to use the fallback model
        chatInstance = null;
        currentModel = MODELS.FALLBACK;
        model = genAI.getGenerativeModel({ model: currentModel });
        
        // Recreate the chat with the fallback model
        const systemPrompt = `You are an AI English conversation partner helping someone practice their English skills. 
        The current conversation topic is: ${topic}. 
        Be supportive, conversational, and provide gentle feedback on grammar or vocabulary when appropriate. 
        Keep your responses concise (2-3 sentences) and engaging.`;
        
        chatInstance = model.startChat({
          history: [
            {
              role: "user",
              parts: `System instruction (please follow these guidelines): ${systemPrompt}`
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        });
        
        // Try again with the fallback model
        const fallbackResult = await chatInstance.sendMessage(userMessage);
        const fallbackResponse = await fallbackResult.response;
        const fallbackText = fallbackResponse.text();
        
        return fallbackText;
      } else {
        // If it's not a quota error or fallback also failed, throw the error
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error with Gemini API:", error);
    
    // Custom message for API key errors
    if (error.message && error.message.includes("API key")) {
      return `There seems to be an issue with your API key. Please check your settings and make sure you've entered a valid Google Gemini API key.`;
    }
    
    // Custom message for rate limit errors
    if (error.message && error.message.includes("429")) {
      return `You've reached the API rate limit. Please try again in a few minutes or use a different API key in the Settings page.`;
    }
    
    return `Sorry, I encountered an error. Please check the Settings page to ensure your API key is correctly set up.`;
  }
};

// Get feedback on user's speaking
export const getLanguageFeedback = async (userMessage: string): Promise<{
  feedback: string,
  fluencyScore: number,
  vocabularyScore: number,
  grammarScore: number
}> => {
  try {
    // Get fresh instance with current API key
    const genAI = getGenAIInstance();
    
    // Try with primary model first
    let currentModel = MODELS.PRIMARY;
    let model = genAI.getGenerativeModel({ model: currentModel });
    
    try {
      // Create a new chat session for the feedback
      const feedbackChat = model.startChat({
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent evaluation
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      });
      
      const prompt = `
        Analyze the following English sentence or paragraph for language learning feedback:
        
        "${userMessage}"
        
        Provide a brief assessment covering:
        1. A short piece of feedback (1 sentence)
        2. A fluency score (0-100)
        3. A vocabulary score (0-100)
        4. A grammar score (0-100)
        
        Format your response as a JSON object with these keys exactly: 
        {
          "feedback": "your feedback here",
          "fluencyScore": number,
          "vocabularyScore": number,
          "grammarScore": number
        }
      `;
      
      // Send the message using the chat instance
      const result = await feedbackChat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      // Extract the JSON from the response
      // First try to parse the whole response as JSON
      try {
        return JSON.parse(text);
      } catch (e) {
        // If that fails, try to extract JSON from the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        // If still no valid JSON, throw an error
        throw new Error("Could not parse feedback response as JSON");
      }
    } catch (error: any) {
      console.error(`Error with model ${currentModel}:`, error);
      
      // If we get a 429 error (quota exceeded) and we're using the primary model, try the fallback
      if (error.message && error.message.includes("429") && currentModel === MODELS.PRIMARY) {
        console.log("Trying fallback model for feedback due to quota limits...");
        
        // Use the fallback model
        currentModel = MODELS.FALLBACK;
        model = genAI.getGenerativeModel({ model: currentModel });
        
        // Create a new chat session with fallback model
        const feedbackChat = model.startChat({
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        });
        
        const prompt = `
          Analyze the following English sentence or paragraph for language learning feedback:
          
          "${userMessage}"
          
          Provide a brief assessment covering:
          1. A short piece of feedback (1 sentence)
          2. A fluency score (0-100)
          3. A vocabulary score (0-100)
          4. A grammar score (0-100)
          
          Format your response as a JSON object with these keys exactly: 
          {
            "feedback": "your feedback here",
            "fluencyScore": number,
            "vocabularyScore": number,
            "grammarScore": number
          }
        `;
        
        // Try again with fallback model
        const fallbackResult = await feedbackChat.sendMessage(prompt);
        const fallbackResponse = await fallbackResult.response;
        const fallbackText = fallbackResponse.text().trim();
        
        // Extract JSON from fallback response
        try {
          return JSON.parse(fallbackText);
        } catch (e) {
          const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error("Could not parse feedback response as JSON from fallback model");
        }
      } else {
        // If it's not a quota error or fallback also failed, throw the error
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error getting language feedback:", error);
    
    // Custom error message based on error type
    if (error.message && error.message.includes("API key")) {
      return {
        feedback: "Please check your API key in Settings.",
        fluencyScore: 50,
        vocabularyScore: 50,
        grammarScore: 50
      };
    }
    
    return {
      feedback: "Could not analyze your response. Check your API key in Settings.",
      fluencyScore: 50,
      vocabularyScore: 50,
      grammarScore: 50
    };
  }
};
