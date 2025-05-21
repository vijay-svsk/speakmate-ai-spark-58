
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const API_KEY = "AIzaSyBcZENeo3gkU6YVQYKCYf8EhOltT87q4es";
const genAI = new GoogleGenerativeAI(API_KEY);

// Store chat history during the session
let chatHistory: { role: "user" | "model", parts: string }[] = [];

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Initialize chat model and session
const initChatSession = async (topic: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  // Set initial system prompt based on topic
  const systemPrompt = `You are an AI English conversation partner helping someone practice their English skills. 
  The current conversation topic is: ${topic}. 
  Be supportive, conversational, and provide gentle feedback on grammar or vocabulary when appropriate. 
  Keep your responses concise (2-3 sentences) and engaging.`;
  
  // Reset chat history and add system prompt
  chatHistory = [{ role: "model", parts: systemPrompt }];
  
  return model;
};

// Send message to Gemini and get response
export const sendMessageToGemini = async (userMessage: string, topic: string): Promise<string> => {
  try {
    // Add user message to chat history
    chatHistory.push({ role: "user", parts: userMessage });
    
    // Get or initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create chat based on history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
      safetySettings,
    });
    
    // Send the message
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();
    
    // Add AI response to chat history
    chatHistory.push({ role: "model", parts: responseText });
    
    return responseText;
  } catch (error: any) {
    console.error("Error with Gemini API:", error);
    return `Sorry, I encountered an error: ${error.message}`;
  }
};

// Reset the chat history for a new conversation
export const resetChatHistory = (topic: string): void => {
  // Initialize with system prompt for the topic
  const systemPrompt = `You are an AI English conversation partner helping someone practice their English skills. 
  The current conversation topic is: ${topic}. 
  Be supportive, conversational, and provide gentle feedback on grammar or vocabulary when appropriate. 
  Keep your responses concise (2-3 sentences) and engaging.`;
  
  chatHistory = [{ role: "model", parts: systemPrompt }];
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
