import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, AlertCircle, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';
import { Question } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface QuizInterfaceProps {
  questions: Question[];
  mode: 'Practice' | 'Exam';
  onComplete: (score: number, answers: number[]) => void;
}

export default function QuizInterface({ questions, mode, onComplete }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [userAnswers, setUserAnswers] = React.useState<number[]>([]);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(questions.length * 90); // 90 seconds per question

  const currentQuestion = questions[currentIndex];

  React.useEffect(() => {
    if (mode === 'Exam' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (mode === 'Exam' && timeLeft === 0) {
      const finalAnswers = [...userAnswers];
      finalAnswers[currentIndex] = selectedOption ?? -1;
      handleFinish(finalAnswers);
    }
  }, [timeLeft, mode]);

  const handleOptionSelect = (idx: number) => {
    if (showExplanation && mode === 'Practice') return;
    setSelectedOption(idx);
    
    if (mode === 'Practice') {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = selectedOption ?? -1;
    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = (finalAnswers = userAnswers) => {
    const score = questions.reduce((acc, q, idx) => {
      return acc + (finalAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    onComplete(score, finalAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 glass-card p-4">
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-cyber-blue">
            QUESTION {currentIndex + 1} / {questions.length}
          </div>
          <div className="h-2 w-32 bg-cyber-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyber-blue"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border",
            currentQuestion.difficulty === 'Beginner' && "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
            currentQuestion.difficulty === 'Intermediate' && "text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5",
            currentQuestion.difficulty === 'Advanced' && "text-purple-400 border-purple-500/30 bg-purple-500/5"
          )}>
            {currentQuestion.difficulty}
          </div>
        </div>
        
        {mode === 'Exam' && (
          <div className={cn(
            "flex items-center gap-2 font-mono font-bold",
            timeLeft < 60 ? "text-red-500 animate-pulse" : "text-cyber-blue"
          )}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Question Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="glass-card p-8 border-l-4 border-l-cyber-blue">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">
              <AlertCircle className="w-4 h-4" />
              Scenario Analysis
            </div>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-200 mb-6">
              <ReactMarkdown>{currentQuestion.scenario}</ReactMarkdown>
            </div>
            <h2 className="text-2xl font-bold text-white border-t border-cyber-border pt-6">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              const showResult = showExplanation && mode === 'Practice';

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                  className={cn(
                    "p-6 glass-card text-left transition-all relative group overflow-hidden",
                    isSelected && !showResult && "border-cyber-blue bg-cyber-blue/5",
                    showResult && isCorrect && "border-emerald-500 bg-emerald-500/10",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                    !isSelected && !showResult && "hover:border-gray-600"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded flex items-center justify-center font-mono text-sm border",
                      isSelected ? "bg-cyber-blue border-cyber-blue text-black" : "border-cyber-border text-gray-500"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg">{option}</span>
                    
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 ml-auto text-emerald-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 ml-auto text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && mode === 'Practice' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5"
            >
              <div className="flex items-center gap-2 text-emerald-500 font-bold mb-2">
                <Info className="w-5 h-5" />
                Technical Explanation
              </div>
              <div className="text-gray-300 leading-relaxed">
                <ReactMarkdown>{currentQuestion.explanation}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={cn(
                "px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all",
                selectedOption === null 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-cyber-blue text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
              )}
            >
              {currentIndex === questions.length - 1 ? 'FINISH EXAM' : 'NEXT QUESTION'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
