
import { GoogleGenAI } from "@google/genai";

export const chatWithAssistant = async (message: string, history: any[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the Official AI Legal Assistant for the Sindh Information Commission (SIC). 
      Your goal is to help citizens understand the Sindh Transparency and Right to Information Act, 2016.
      Provide guidance on:
      1. How to file a complaint/appeal with the Commission when a department refuses information.
      2. The mandatory prerequisites: First applying to the PIO and then filing an Internal Review with the HOD.
      3. Timelines: PIO has 15 working days to respond. Complaint must be filed within 30 days of unsatisfactory response.
      4. What information is exempt from disclosure.
      Be professional, empathetic, and clear. Emphasize that the SIC is the appellate body.`,
      tools: [{ googleSearch: {} }]
    },
  });

  try {
    const response = await chat.sendMessage({ message });
    return {
      text: response.text || "I'm sorry, I couldn't process that request.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      })) || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Connection error. Please check your internet or try again later.", sources: [] };
  }
};
