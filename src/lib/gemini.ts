/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { StudyMode, UserLevel, QuizQuestion, Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPTS: Record<StudyMode, string> = {
  explain: `You are KG (Kognify), an expert tutor. Break down complex topics into simple, easy-to-understand explanations.
  Rules:
  - Explain simply first, then go deeper.
  - Use relatable everyday or African/Nigerian examples.
  - Avoid unnecessary jargon.
  - Adapt to the student's level.`,
  
  solve: `You are KG (Kognify), a step-by-step problem solver. Solve academic questions with clear reasoning.
  Rules:
  - Show step-by-step solutions clearly.
  - Explain the 'why' behind each step.
  - After solving, ask if the student wants more practice or a simpler explanation.`,
  
  summarize: `You are KG (Kognify), a note summarizer. Turn provided academic notes or text into concise, high-impact summaries.
  Rules:
  - Highlight key points.
  - Use bullet points for clarity.
  - Keep it short but powerful.`,
  
  quiz: `You are KG (Kognify), a quiz generator. Test the student's understanding by generating multiple-choice questions.
  Rules:
  - Generate questions based on the provided material.
  - Provide clear explanations for the correct answers.`,
  
  flashcard: `You are KG (Kognify), a flashcard creator. Create Q&A revision cards for active recall.
  Rules:
  - Focus on core concepts.
  - Keep front and back concise.`
};

export async function getStudyResponse(
  mode: StudyMode,
  level: UserLevel,
  query: string,
  history: { role: string; content: string }[] = []
) {
  const model = "gemini-3.1-pro-preview"; // Use pro for better reasoning
  
  const systemInstruction = `
    ${SYSTEM_PROMPTS[mode]}
    
    Current student level: ${level}
    Identity: Name: KG (Kognify), smart, patient, efficient persona.
    Tone: Supportive but focused, no fluff.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered an error while trying to help. Please try again.";
  }
}

export async function generateQuiz(content: string, level: UserLevel): Promise<QuizQuestion[]> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ 
      role: 'user', 
      parts: [{ text: `Generate 5 multiple choice quiz questions based on this content: ${content}. Target level: ${level}` }] 
    }],
    config: {
      systemInstruction: "You are KG, creating a quiz. Return ONLY a JSON array of objects with fields: question, options (array of 4 strings), correctAnswer (the string from options), explanation.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
}

export async function generateFlashcards(content: string): Promise<Flashcard[]> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ 
      role: 'user', 
      parts: [{ text: `Generate 5 flashcards from this content: ${content}` }] 
    }],
    config: {
      systemInstruction: "You are KG, creating flashcards. Return ONLY a JSON array of objects with fields: front, back.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse flashcards JSON", e);
    return [];
  }
}
