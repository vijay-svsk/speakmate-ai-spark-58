
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const API_KEY = "AIzaSyBcZENeo3gkU6YVQYKCYf8EhOltT87q4es";
const genAI = new GoogleGenerativeAI(API_KEY);

// Store chat instance for conversation continuity
let chatInstance;

// Reset the chat history for a new conversation
export const resetChatHistory = (topic: string): void => {
  chatInstance = null;
  
  // The system prompt will be sent as the first message after initializing the chat
  console.log(`Chat reset with topic: ${topic}`);
};

// Send message to Gemini and get response
export const sendMessageToGemini = async (userMessage: string, topic: string): Promise<string> => {
  try {
    // Get the model - updated to use the correct model name (gemini-1.5-pro or gemini-1.0-pro)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
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
    
    // Send the message using the chat instance
    const result = await chatInstance.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();
    
    return responseText;
  } catch (error: any) {
    console.error("Error with Gemini API:", error);
    return `Sorry, I encountered an error: ${error.message}`;
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
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
      
      // If still no valid JSON, return default values
      throw new Error("Could not parse feedback response as JSON");
    }
  } catch (error: any) {
    console.error("Error getting language feedback:", error);
    return {
      feedback: "Could not analyze your response at this time.",
      fluencyScore: 50,
      vocabularyScore: 50,
      grammarScore: 50
    };
  }
};
