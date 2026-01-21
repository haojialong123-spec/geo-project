import { GoogleGenAI } from "@google/genai";
import { PROMPT_EXTRACTION, PROMPT_ARTICLE_GEN, PROMPT_VIDEO_GEN, PROMPT_ZHIHU_GEN, FIRM_KNOWLEDGE_BASE } from '../constants';
import { ExtractionResult } from '../types';

// FIX: Lazy initialization of the Gemini Client.
// Do NOT initialize 'new GoogleGenAI' at the top level.
// If process.env.API_KEY is undefined during module load, it crashes the app (White Screen).
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key 缺失。请在环境配置中设置 GEMINI_API_KEY 或 API_KEY。");
  }
  return new GoogleGenAI({ apiKey });
};

export const extractPainPoints = async (transcript: string): Promise<ExtractionResult> => {
  // Inject user input into the prompt template
  const fullPrompt = PROMPT_EXTRACTION.replace('{{RAW_TEXT}}', transcript);

  try {
    const ai = getAiClient(); // Initialize here
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as ExtractionResult;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    // Throw a user-friendly error
    if (error instanceof Error) {
        throw new Error(`深度法律分析失败: ${error.message}`);
    }
    throw new Error("深度法律分析失败，请检查文本内容或重试。");
  }
};

const generateContentCommon = async (
  promptTemplate: string,
  painPoints: string[],
  selectedQuotes: string[],
  legalConcepts: string[],
  marketingDirection?: string
): Promise<string> => {

  // Inject Knowledge Base FIRST
  let prompt = promptTemplate.replace('{{FIRM_KB}}', FIRM_KNOWLEDGE_BASE);
  
  // Inject Dynamic Variables
  prompt = prompt.replace('{{Issue_Tags}}', painPoints.join(', '));
  prompt = prompt.replace('{{Selected_Quotes}}', selectedQuotes.join('; '));
  prompt = prompt.replace('{{Legal_Concepts}}', legalConcepts.join(', '));
  prompt = prompt.replace('{{Marketing_Direction}}', marketingDirection || '北京建工法律纠纷解决方案');

  try {
    const ai = getAiClient(); // Initialize here
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "生成失败。";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
        return "生成失败：API Key 无效或缺失。";
    }
    return "内容生成出错，请重试。";
  }
};

export const generateArticle = async (
  painPoints: string[],
  selectedQuotes: string[],
  legalConcepts: string[],
  marketingDirection?: string
) => {
  return generateContentCommon(PROMPT_ARTICLE_GEN, painPoints, selectedQuotes, legalConcepts, marketingDirection);
};

export const generateVideoScript = async (
  painPoints: string[],
  selectedQuotes: string[],
  legalConcepts: string[],
  marketingDirection?: string
) => {
  return generateContentCommon(PROMPT_VIDEO_GEN, painPoints, selectedQuotes, legalConcepts, marketingDirection);
};

export const generateZhihuAnswer = async (
  painPoints: string[],
  selectedQuotes: string[],
  legalConcepts: string[],
  marketingDirection?: string
) => {
  return generateContentCommon(PROMPT_ZHIHU_GEN, painPoints, selectedQuotes, legalConcepts, marketingDirection);
};