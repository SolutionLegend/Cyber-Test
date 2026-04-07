import { GoogleGenAI, Type } from "@google/genai";
import { Category, Difficulty, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not defined in the environment.");
}

export async function generateQuestions(category: Category, difficulty: Difficulty, count: number = 5): Promise<Question[]> {
  const CHUNK_SIZE = 10;
  const numChunks = Math.ceil(count / CHUNK_SIZE);
  const chunks: number[] = [];
  
  for (let i = 0; i < numChunks; i++) {
    const remaining = count - (i * CHUNK_SIZE);
    chunks.push(Math.min(CHUNK_SIZE, remaining));
  }

    const fetchChunk = async (chunkCount: number, retryCount = 0): Promise<Question[]> => {
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

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
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
      } catch (e: any) {
        if (retryCount < 2) {
          console.warn(`Chunk generation failed, retrying (${retryCount + 1}/2)...`, e);
          return fetchChunk(chunkCount, retryCount + 1);
        }
        throw e;
      }
    };

  try {
    const results = await Promise.all(chunks.map(chunkCount => fetchChunk(chunkCount)));
    return results.flat();
  } catch (error: any) {
    console.error("Error generating questions:", error);
    if (error?.status === "PERMISSION_DENIED" || error?.code === 403) {
      throw new Error("Gemini API Permission Denied: Please check if your API key is valid and has access to the specified model (gemini-2.0-flash).");
    }
    if (error?.status === "NOT_FOUND" || error?.code === 404) {
      throw new Error("Gemini API Model Not Found: The specified model (gemini-2.0-flash) was not found. Please check your API configuration.");
    }
    throw error;
  }
}
