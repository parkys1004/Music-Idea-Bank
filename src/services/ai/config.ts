import { GoogleGenAI } from "@google/genai";

let customApiKey: string | null = null;
let selectedModel: string = "gemini-3-flash-preview";

export const AVAILABLE_MODELS = [
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash (속도/가성비 추천)" },
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (고지능/추론 강화)" },
  { id: "gemini-2.5-flash-latest", name: "Gemini 2.5 Flash (안정적)" },
];

export function setApiKey(key: string | null) {
  customApiKey = key;
}

export function getApiKey(): string | null {
  return customApiKey;
}

export function setModel(modelId: string) {
  if (AVAILABLE_MODELS.some(m => m.id === modelId)) {
    selectedModel = modelId;
  }
}

export function getModel(): string {
  return selectedModel;
}

export function getAiClient() {
  const key = customApiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("API Key not found. Please set your API key in the settings.");
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function testConnection(key: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
      model: selectedModel,
      contents: "Test connection",
    });
    return true;
  } catch (error: any) {
    console.error("Connection test failed:", error);
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
       throw new Error("QUOTA_EXCEEDED");
    }
    return false;
  }
}
