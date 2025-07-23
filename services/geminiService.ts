
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function estimateCaloriesFromImage(base64Image: string): Promise<{ totalCalories: number; items: { name: string; calories: number }[] }> {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };
        const textPart = {
            text: `You are an expert nutritionist. Analyze the image of the meal provided. Identify each food item, estimate its weight in grams, and calculate its caloric value. Provide the total estimated calories for the entire meal. Your response MUST be a valid JSON object, and nothing else. The JSON object should follow this structure: { "totalCalories": number, "items": [ { "name": "food item name in Portuguese", "calories": number } ] }. If you cannot identify the food, return { "totalCalories": 0, "items": [] }.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        totalCalories: { type: Type.NUMBER },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    calories: { type: Type.NUMBER }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error estimating calories:", error);
        throw new Error("Falha ao estimar calorias. Por favor, tente novamente.");
    }
}

export async function getMealSuggestion(mealType: string, dietPlan: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a creative chef specializing in healthy Portuguese cuisine. Based on the diet plan below, suggest a simple and delicious recipe for ${mealType}. Be creative but stick to the allowed ingredients. Provide just the recipe name and a short description, in Portuguese. Diet Plan: "${dietPlan}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting meal suggestion:", error);
        throw new Error("Não foi possível gerar uma sugestão de refeição.");
    }
}

export async function getMotivationalQuote(): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a short, inspiring motivational quote in Portuguese about perseverance, health, and weight loss. Make it positive and encouraging.',
             config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting motivational quote:", error);
        return "Acredite em si mesmo e em tudo que você é. Saiba que existe algo dentro de você que é maior que qualquer obstáculo.";
    }
}

export async function getExerciseSuggestions(): Promise<string[]> {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Suggest 3 simple, at-home exercises for weight loss that require no equipment, suitable for a beginner. Return the response as a JSON array of objects, each with "name" and "description" properties, in Portuguese. For example: [{"name": "Agachamentos", "description": "3 séries de 15 repetições"}]. Do not include any other text or explanation.',
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting exercise suggestions:", error);
        throw new Error("Não foi possível obter sugestões de exercícios.");
    }
}
