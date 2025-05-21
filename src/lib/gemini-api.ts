
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
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Extract the JSON from the response
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
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
