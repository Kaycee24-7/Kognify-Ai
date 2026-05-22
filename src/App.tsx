/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Chat } from "./components/Chat";
import { QuizView } from "./components/QuizView";
import { FlashcardView } from "./components/FlashcardView";
import { StudyMode, UserLevel, Message, QuizQuestion, Flashcard } from "./types";
import { getStudyResponse, generateQuiz, generateFlashcards } from "./lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { Eraser, Settings, BookOpen, Trophy } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [mode, setMode] = useState<StudyMode>('explain');
  const [level, setLevel] = useState<UserLevel>('intermediate');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Interaction states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await getStudyResponse(mode, level, content, history);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Special handling for content-generating modes
      if (mode === 'quiz') {
        const quiz = await generateQuiz(responseText, level);
        if (quiz.length > 0) setQuizQuestions(quiz);
      } else if (mode === 'flashcard') {
        const cards = await generateFlashcards(responseText);
        if (cards.length > 0) setFlashcards(cards);
      }

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setQuizQuestions([]);
    setFlashcards([]);
  };

  const renderContent = () => {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header - Height 72px */}
        <header className="h-[72px] border-b border-brand-border flex items-center justify-between px-8 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-brand-text-muted text-[14px]">Status:</span>
            <span className="font-semibold text-brand-text text-[14px] capitalize">{mode} mode</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearChat}
              className="px-3 py-1.5 text-brand-text-muted hover:text-brand-text text-xs font-semibold hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
              title="Clear Chat"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear
            </button>
            <div className="status-chip">
              Patient Tutor Mode Active
            </div>
          </div>
        </header>

        {/* Content Area - 2 Columns */}
        <div className="flex-1 grid grid-cols-[1fr,320px] overflow-hidden">
          {/* Main Chat/View Area */}
          <div className="flex flex-col border-r border-brand-border bg-white overflow-hidden">
            {mode === 'quiz' && quizQuestions.length > 0 ? (
              <QuizView questions={quizQuestions} onRestart={() => setQuizQuestions([])} />
            ) : mode === 'flashcard' && flashcards.length > 0 ? (
              <FlashcardView cards={flashcards} />
            ) : (
              <Chat 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isGenerating={isGenerating} 
                onClear={clearChat}
                currentMode={mode}
              />
            )}
          </div>

          {/* Knowledge Panel */}
          <aside className="knowledge-panel p-8 bg-brand-bg overflow-y-auto">
            <div className="panel-card">
              <div className="panel-title flex items-center gap-2 mb-3 text-[14px] font-[700] text-brand-text">
                <Settings className="w-4 h-4 text-brand-primary" />
                Study Controls
              </div>
              <div className="level-selector flex bg-brand-border p-1 rounded-lg mb-4">
                {['beginner', 'intermediate', 'advanced'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l as UserLevel)}
                    className={cn(
                      "flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize",
                      level === l ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-brand-text-muted leading-relaxed">
                Adapting explanations for {level} understanding.
              </p>
            </div>

            <div className="panel-card">
              <div className="panel-title flex items-center gap-2 mb-3 text-[14px] font-[700] text-brand-text">
                <BookOpen className="w-4 h-4 text-brand-primary" />
                Key Concepts
              </div>
              <ul className="space-y-3 text-[13px] text-brand-text">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                  Step-by-step reasoning
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                  Relatable analogies
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                  Active recall drills
                </li>
              </ul>
            </div>

            <div className="panel-card overflow-hidden">
              <div className="panel-title flex items-center gap-2 mb-3 text-[14px] font-[700] text-brand-text">
                <Trophy className="w-4 h-4 text-brand-primary" />
                Quick Revision
              </div>
              <div className="flashcard-preview bg-gradient-to-br from-brand-primary to-[#1E40AF] rounded-lg p-4 text-white text-center flex flex-col justify-center min-h-[120px]">
                <p className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Coming Next</p>
                <p className="text-[13px] font-semibold">Ready for a quick summary test?</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar 
        currentMode={mode} 
        onModeChange={(newMode) => {
          setMode(newMode);
          // Optional: handle mode change transitions
        }} 
        currentLevel={level} 
        onLevelChange={setLevel} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
