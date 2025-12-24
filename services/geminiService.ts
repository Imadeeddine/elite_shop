
import { GoogleGenAI } from "@google/genai";

// Use the API key directly from process.env as per guidelines
export const generateProductDescription = async (name: string, category: string) => {
  // Always verify API key existence before use
  if (!process.env.API_KEY) return "وصف السلعة غير متاح حالياً (يرجى إعداد مفتاح API).";
  
  try {
    // Correct initialization: always use named parameter { apiKey }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use gemini-3-flash-preview for basic text tasks like description generation
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, professional, and persuasive product description in Arabic for a product named "${name}" in the category "${category}". Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      },
    });
    
    // Extracting output text using the .text property (not a method)
    return response.text || "تعذر إنشاء وصف تلقائي.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء إنشاء الوصف بالذكاء الاصطناعي.";
  }
};
