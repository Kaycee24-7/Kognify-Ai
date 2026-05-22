/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Loader2, Eraser } from "lucide-react";
import { Message, StudyMode, UserLevel } from "../types";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

interface ChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isGenerating: boolean;
  onClear: () => void;
  currentMode: StudyMode;
}

export function Chat({ messages, onSendMessage, isGenerating, onClear, currentMode }: ChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput("");
  };

  const getPlaceholder = () => {
    switch (currentMode) {
      case 'explain': return "Explain the concept of quantum entanglement...";
      case 'solve': return "Solve for x in 2x + 5 = 15...";
      case 'summarize': return "Paste your notes here to summarize...";
      case 'quiz': return "What should the quiz be about?";
      case 'flashcard': return "Create flashcards for periodic table elements...";
      default: return "Ask KG anything...";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-text">Hello, I'm KG!</h3>
              <p className="text-brand-text-muted mt-2 text-sm leading-relaxed">
                I'm your intelligent study companion. Choose a mode on the left and let's dive into learning together.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 group",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-9 h-9 border-2 border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                message.role === 'user' 
                  ? "bg-slate-200 text-brand-text text-[12px] font-bold" 
                  : "bg-brand-primary text-white text-[12px] font-bold"
              )}>
                {message.role === 'user' ? "YOU" : "KG"}
              </div>
              <div className={cn(
                "max-w-[85%] rounded-[12px] p-4 shadow-sm",
                message.role === 'user'
                  ? "bg-brand-bg border border-brand-border text-brand-text"
                  : "bg-brand-bg border border-brand-border text-brand-text"
              )}>
                <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-sm prose-strong:text-brand-primary">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                <p className={cn(
                  "text-[10px] mt-2 text-brand-text-muted font-medium uppercase tracking-wider",
                  message.role === 'user' ? "text-right" : "text-left"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-primary text-white font-bold text-[12px]">
              KG
            </div>
            <div className="bg-brand-bg text-brand-text-muted rounded-[12px] p-4 border border-brand-border italic text-sm">
              KG is preparing your lesson...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Input Bar Height 80px */}
      <div className="h-[80px] px-8 bg-white border-t border-brand-border flex items-center">
        <form onSubmit={handleSubmit} className="flex-1 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder={getPlaceholder()}
            className="flex-1 bg-brand-bg border border-brand-border rounded-[12px] px-5 py-3 text-[14px] text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={cn(
              "send-btn flex items-center justify-center px-6 py-3 rounded-[12px] font-semibold text-[14px] transition-all",
              input.trim() && !isGenerating
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ask KG"}
          </button>
        </form>
      </div>
    </div>
  );
}
