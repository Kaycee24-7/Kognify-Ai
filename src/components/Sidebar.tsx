/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, HelpCircle, FileText, Brain, Layout, Settings, Trophy } from "lucide-react";
import { StudyMode, UserLevel } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface SidebarProps {
  currentMode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
  currentLevel: UserLevel;
  onLevelChange: (level: UserLevel) => void;
}

const MODES = [
  { id: 'explain', name: 'Explain', icon: BookOpen, description: 'Break down complex topics' },
  { id: 'solve', name: 'Solve', icon: HelpCircle, description: 'Step-by-step solutions' },
  { id: 'summarize', name: 'Summarize', icon: FileText, description: 'Turn notes into insights' },
  { id: 'quiz', name: 'Quiz', icon: Trophy, description: 'Test your knowledge' },
  { id: 'flashcard', name: 'Flashcards', icon: Brain, description: 'Active recall revision' },
] as const;

const LEVELS: UserLevel[] = ['beginner', 'intermediate', 'advanced'];

export function Sidebar({ currentMode, onModeChange, currentLevel, onLevelChange }: SidebarProps) {
  return (
    <aside className="w-[240px] h-full flex flex-col bg-brand-sidebar border-r border-brand-border p-6 overflow-hidden">
      <div className="logo flex items-center gap-2.5 mb-10 text-[22px] font-[800] text-brand-primary">
        <div className="logo-icon w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
          KG
        </div>
        Kognify
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto">
        <div className="nav-group">
          <p className="nav-label text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider mb-3">Study Modes</p>
          <div className="space-y-1">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id as StudyMode)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all font-medium text-[14px]",
                    isActive 
                      ? "bg-brand-primary-light text-brand-primary" 
                      : "text-brand-text hover:bg-brand-bg md:hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "text-brand-text-muted")} />
                  {mode.name} Mode
                </button>
              );
            })}
          </div>
        </div>

        <div className="nav-group">
          <p className="nav-label text-[11px] font-semibold text-brand-text-muted uppercase tracking-wider mb-3">My Library</p>
          <div className="space-y-1">
            <div className="nav-item flex items-center gap-3 p-2.5 rounded-lg text-brand-text text-[14px] font-medium cursor-pointer hover:bg-brand-bg">
              <BookOpen className="w-4 h-4 text-brand-text-muted" />
              Physics 101
            </div>
            <div className="nav-item flex items-center gap-3 p-2.5 rounded-lg text-brand-text text-[14px] font-medium cursor-pointer hover:bg-brand-bg">
              <BookOpen className="w-4 h-4 text-brand-text-muted" />
              Economics
            </div>
            <div className="nav-item flex items-center gap-3 p-2.5 rounded-lg text-brand-text text-[14px] font-medium cursor-pointer hover:bg-brand-bg">
              <BookOpen className="w-4 h-4 text-brand-text-muted" />
              History
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-brand-border">
        <div className="panel-card-mini bg-brand-bg rounded-lg p-3">
          <p className="nav-label text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-2">Complexity</p>
          <div className="flex bg-brand-border p-1 rounded-lg">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => onLevelChange(level)}
                className={cn(
                  "flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all capitalize",
                  currentLevel === level
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-brand-text-muted hover:text-brand-text"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <button className="w-full mt-4 flex items-center gap-3 p-2 text-brand-text-muted hover:text-brand-text transition-colors text-[13px] font-medium">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
