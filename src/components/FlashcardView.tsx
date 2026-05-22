/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Flashcard } from "../types";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, RefreshCcw, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FlashcardViewProps {
  cards: Flashcard[];
}

export function FlashcardView({ cards }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <p className="text-slate-500">No flashcards created yet. Try asking KG to create some flashcards!</p>
      </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-8 content-center justify-center items-center">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Active Recall</h2>
        <p className="text-slate-500 mt-2">Test your memory with these flashcards</p>
      </div>

      <div className="relative w-full aspect-[16/10] perspective-1000">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative cursor-pointer preserve-3d"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="absolute top-6 left-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Question</div>
            <p className="text-2xl font-bold text-slate-800 leading-tight">
              {cards[currentIndex].front}
            </p>
            <div className="absolute bottom-10 flex items-center gap-2 text-indigo-400 font-medium text-sm">
              <RotateCcw className="w-4 h-4" />
              Click to flip
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-indigo-600 rounded-[2rem] shadow-2xl p-12 flex flex-col items-center justify-center text-center text-white rotate-y-180"
          >
            <div className="absolute top-6 left-6 text-[10px] font-bold text-white/50 uppercase tracking-widest">Answer</div>
            <p className="text-xl font-medium leading-relaxed">
              {cards[currentIndex].back}
            </p>
            <div className="absolute bottom-10 flex items-center gap-2 text-white/50 font-medium text-sm">
              <RotateCcw className="w-4 h-4" />
              Click to flip back
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 flex items-center gap-8">
        <button
          onClick={handlePrev}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all hover:scale-105"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center font-semibold text-slate-400 font-mono tracking-widest">
          {currentIndex + 1} / {cards.length}
        </div>

        <button
          onClick={handleNext}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all hover:scale-105"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <button 
        onClick={() => {
          setIsFlipped(false);
          setCurrentIndex(0);
        }}
        className="mt-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors text-sm font-medium"
      >
        <RefreshCcw className="w-4 h-4" />
        Reset Deck
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
