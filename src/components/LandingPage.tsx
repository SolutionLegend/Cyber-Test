import React from 'react';
import { motion } from 'motion/react';
import { Shield, Network, Terminal, Lock, Clock, BookOpen, ChevronRight, BarChart, ListOrdered } from 'lucide-react';
import { Category, Difficulty, QuizHistory } from '../types';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: (category: Category, mode: 'Practice' | 'Exam', difficulty: Difficulty, questionCount: number) => void;
  history: QuizHistory[];
}

const categories: { name: Category; icon: React.ReactNode; description: string; color: string }[] = [
  {
    name: 'Security+',
    icon: <Shield className="w-8 h-8" />,
    description: 'Core security principles, risk management, and incident response.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Network+',
    icon: <Network className="w-8 h-8" />,
    description: 'Networking fundamentals, implementations, and security.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'Ethical Hacking',
    icon: <Terminal className="w-8 h-8" />,
    description: 'Penetration testing, vulnerability assessment, and offensive security.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'General Cybersecurity',
    icon: <Lock className="w-8 h-8" />,
    description: 'Broad overview of industry standards and emerging threats.',
    color: 'from-orange-500 to-red-500'
  }
];

const difficulties: { level: Difficulty; description: string; color: string }[] = [
  { level: 'Beginner', description: 'Foundational concepts and basic terminology.', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
  { level: 'Intermediate', description: 'Scenario-based application of core principles.', color: 'text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5' },
  { level: 'Advanced', description: 'Complex troubleshooting and high-level strategy.', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' }
];

const questionCounts = [5, 10, 20, 50];

export default function LandingPage({ onStart, history }: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>('Intermediate');
  const [selectedCount, setSelectedCount] = React.useState<number>(10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-cyber-blue to-purple-400 bg-clip-text text-transparent">
          CYBERSHIELD PRO
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Master the art of cybersecurity through high-stakes scenarios and professional certification prep.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedCategory(cat.name)}
            className={cn(
              "glass-card p-6 text-left transition-all duration-300 hover:border-cyber-blue group",
              selectedCategory === cat.name ? "border-cyber-blue ring-2 ring-cyber-blue/20" : ""
            )}
          >
            <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br", cat.color)}>
              {cat.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-blue transition-colors">{cat.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{cat.description}</p>
          </motion.button>
        ))}
      </div>

      {selectedCategory && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border-t-4 border-t-cyber-blue mb-16"
        >
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">Configure {selectedCategory} Session</h2>
              <p className="text-gray-400 text-sm">Select your difficulty, question count, and preferred mode to begin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {/* Difficulty Selector Integrated */}
              <div className="w-full">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-widest justify-center">
                  <BarChart className="w-3 h-3" />
                  Difficulty Level
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.level}
                      onClick={() => setSelectedDifficulty(diff.level)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-center",
                        selectedDifficulty === diff.level 
                          ? cn("border-opacity-100 bg-cyber-blue/5", diff.color.split(' ')[1]) 
                          : "border-cyber-border opacity-40 hover:opacity-100 bg-transparent"
                      )}
                    >
                      <div className={cn("font-bold text-xs", diff.level === selectedDifficulty ? diff.color.split(' ')[0] : "text-white")}>
                        {diff.level}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Selector */}
              <div className="w-full">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-widest justify-center">
                  <ListOrdered className="w-3 h-3" />
                  Question Count
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedCount(count)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-center font-mono text-sm",
                        selectedCount === count 
                          ? "border-cyber-blue bg-cyber-blue/10 text-cyber-blue" 
                          : "border-cyber-border opacity-40 hover:opacity-100 bg-transparent text-white"
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <div className="mt-4 px-2">
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    step="5"
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-cyber-border rounded-lg appearance-none cursor-pointer accent-cyber-blue"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
                    <span>5</span>
                    <span>{selectedCount} QUESTIONS</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
              <button
                onClick={() => onStart(selectedCategory, 'Practice', selectedDifficulty, selectedCount)}
                className="w-full md:w-64 p-6 glass-card hover:border-emerald-500 transition-all group flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Practice Mode</div>
                  <div className="text-xs text-gray-400">Untimed, instant feedback</div>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-gray-600 group-hover:text-emerald-500" />
              </button>

              <button
                onClick={() => onStart(selectedCategory, 'Exam', selectedDifficulty, selectedCount)}
                className="w-full md:w-64 p-6 glass-card hover:border-red-500 transition-all group flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Exam Mode</div>
                  <div className="text-xs text-gray-400">Timed, results at the end</div>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-gray-600 group-hover:text-red-500" />
              </button>
            </div>
          </div>
        </motion.div>
      )}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 border-t-4 border-t-cyber-blue relative overflow-hidden group mb-16"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Shield className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Ultimate Certification Simulation</h2>
            <p className="text-gray-400">
              Ready for the real deal? This mode combines questions from all certification domains (Security+, Network+, Ethical Hacking) into a single, high-stakes comprehensive exam.
            </p>
          </div>
          <button
            onClick={() => onStart('Mixed Certification', 'Exam', selectedDifficulty, selectedCount)}
            className="w-full md:w-auto px-12 py-5 bg-cyber-blue text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center justify-center gap-3"
          >
            <Shield className="w-6 h-6" />
            START FULL SIMULATION
          </button>
        </div>
      </motion.div>

      {/* Improvement Feed / History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border-t-4 border-t-emerald-500"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">Performance Feed</h2>
              <p className="text-gray-400 text-sm">Your recent certification attempts and progress.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-emerald-500/5 rounded border border-emerald-500/20">
                <div className="text-[10px] font-mono text-emerald-500 uppercase">Avg Score</div>
                <div className="text-xl font-bold">
                  {Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / history.length)}%
                </div>
              </div>
              <div className="text-center px-4 py-2 bg-cyber-blue/5 rounded border border-cyber-blue/20">
                <div className="text-[10px] font-mono text-cyber-blue uppercase">Total Exams</div>
                <div className="text-xl font-bold">{history.length}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {history.slice(0, 5).map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-4 bg-cyber-dark/40 rounded border border-cyber-border/50 hover:border-cyber-blue/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded flex items-center justify-center text-xs font-bold",
                    entry.score / entry.totalQuestions >= 0.7 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {Math.round((entry.score / entry.totalQuestions) * 100)}%
                  </div>
                  <div>
                    <div className="font-bold text-sm">{entry.category}</div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase">
                      <span>{entry.difficulty}</span>
                      <span>•</span>
                      <span>{entry.mode}</span>
                      <span>•</span>
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-gray-400">{entry.score}/{entry.totalQuestions}</div>
                  <div className="text-[10px] text-gray-600">CORRECT</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
