import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Category, Difficulty, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuestions(category: Category, difficulty: Difficulty, count: number = 5): Promise<Question[]> {
  const CHUNK_SIZE = 10;
  const numChunks = Math.ceil(count / CHUNK_SIZE);
  const chunks: number[] = [];
  
  for (let i = 0; i < numChunks; i++) {
    const remaining = count - (i * CHUNK_SIZE);
    chunks.push(Math.min(CHUNK_SIZE, remaining));
  }

  const fetchChunk = async (chunkCount: number): Promise<Question[]> => {
    const isMixed = category === 'Mixed Certification';
    const prompt = `Generate ${chunkCount} professional cybersecurity exam questions at the ${difficulty} level.
    ${isMixed 
      ? "Balanced mix of Security+, Network+, Ethical Hacking, and general cybersecurity domains." 
      : `Category: ${category}.`}
    Scenario-based, CompTIA/industry standards. Technical accuracy, professional terminology.
    
    JSON array:
    {
      "id": "unique-uuid",
      "scenario": "string",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "string",
      "category": "string",
      "difficulty": "${difficulty}"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
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
  };

  try {
    const results = await Promise.all(chunks.map(chunkCount => fetchChunk(chunkCount)));
    return results.flat();
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}
