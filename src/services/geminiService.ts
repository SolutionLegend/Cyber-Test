import { GoogleGenAI, Type } from "@google/genai";
import { Category, Difficulty, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuestions(category: Category, difficulty: Difficulty, count: number = 5): Promise<Question[]> {
  const isMixed = category === 'Mixed Certification';
  const prompt = `Generate ${count} professional cybersecurity exam questions at the ${difficulty} level.
  ${isMixed 
    ? "The questions MUST be a balanced mix of CompTIA Security+, Network+, Ethical Hacking, and general cybersecurity domains." 
    : `The questions MUST be for the category: ${category}.`}
  Each question MUST be a real-life scenario based on CompTIA or industry standards.
  Focus on technical accuracy and professional terminology appropriate for the ${difficulty} level.
  
  Format the output as a JSON array of objects with the following structure:
  {
    "id": "unique-uuid",
    "scenario": "A detailed real-world situation...",
    "question": "The specific question based on the scenario...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // index of the correct option
    "explanation": "A detailed explanation of why the answer is correct and why others are wrong.",
    "category": "The specific certification category this question belongs to",
    "difficulty": "${difficulty}"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              scenario: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "scenario", "question", "options", "correctAnswer", "explanation", "category", "difficulty"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}
