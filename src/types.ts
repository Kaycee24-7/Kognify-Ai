/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudyMode = 'explain' | 'solve' | 'summarize' | 'quiz' | 'flashcard';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudySession {
  messages: Message[];
  mode: StudyMode;
  level: UserLevel;
  summary?: string;
  quiz?: QuizQuestion[];
  flashcards?: Flashcard[];
}
