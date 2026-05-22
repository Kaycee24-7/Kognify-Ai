/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { QuizQuestion } from "../types";
import { cn } from "../lib/utils";
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizViewProps {
  questions: QuizQuestion[];
  onRestart: () => void;
}

export function QuizView({ questions, onRestart }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <p className="text-slate-500">No questions generated yet. Try asking KG to generate a quiz!</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!selectedOption || isAnswered) return;
    
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center h-full max-w-xl mx-auto space-y-6"
      >
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner">
          <Trophy className="w-12 h-12 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 underline decoration-yellow-400 decoration-4 underline-offset-8">Quiz Completed!</h2>
          <p className="text-slate-600 mt-6 text-lg">
            You scored <span className="font-bold text-indigo-600 text-3xl">{score}</span> out of <span className="font-bold text-slate-900 text-3xl">{questions.length}</span>
          </p>
          <div className="mt-4 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(score / questions.length) * 100}%` }}
              className="bg-indigo-600 h-full"
            />
          </div>
        </div>
        <p className="text-slate-500 italic">
          {score === questions.length ? "Perfect score! You're a genius! 🧠" : 
           score > questions.length / 2 ? "Great job! Keep it up! 🚀" : 
           "Good effort! Let's study a bit more. 📚"}
        </p>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1"
        >
          <RefreshCcw className="w-5 h-5" />
          Start New Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Question {currentIndex + 1} of {questions.length}</p>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 w-8 rounded-full transition-all duration-500",
                  i === currentIndex ? "bg-indigo-600" : i < currentIndex ? "bg-emerald-500" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Score</p>
          <p className="font-mono font-bold text-indigo-600">{score}/{questions.length}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 space-y-8"
        >
          <h3 className="text-2xl font-bold text-slate-800 leading-tight">
            {currentQuestion.question}
          </h3>

          <div className="grid gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = isAnswered && option === currentQuestion.correctAnswer;
              const isWrong = isAnswered && isSelected && option !== currentQuestion.correctAnswer;

              return (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group",
                    !isAnswered && !isSelected && "border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50",
                    !isAnswered && isSelected && "border-indigo-600 bg-indigo-50/50",
                    isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900",
                    isWrong && "border-rose-500 bg-rose-50 text-rose-900"
                  )}
                >
                  <span className="font-medium text-lg">{option}</span>
                  {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                  {isWrong && <XCircle className="w-6 h-6 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-6 rounded-2xl border-l-4",
                  selectedOption === currentQuestion.correctAnswer
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-rose-50 border-rose-500 text-rose-900"
                )}
              >
                <p className="font-bold flex items-center gap-2 mb-2">
                  {selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Oops! Incorrect"}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleConfirm}
            disabled={!selectedOption}
            className={cn(
              "px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all",
              selectedOption 
                ? "bg-indigo-600 text-white shadow-indigo-200 hover:-translate-y-1" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "View Results"}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
