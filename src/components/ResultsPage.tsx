import { motion } from 'motion/react';
import { Trophy, Target, Clock, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { Question } from '../types';
import { cn } from '../lib/utils';

interface ResultsPageProps {
  questions: Question[];
  userAnswers: number[];
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

export default function ResultsPage({ questions, userAnswers, score, onRestart, onHome }: ResultsPageProps) {
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center mb-12 relative overflow-hidden"
      >
        <div className={cn(
          "absolute top-0 left-0 w-full h-2",
          isPassed ? "bg-emerald-500" : "bg-red-500"
        )} />
        
        <div className="flex justify-center mb-6">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center",
            isPassed ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
          )}>
            <Trophy className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">
          {isPassed ? 'CERTIFICATION ACHIEVED' : 'ADDITIONAL STUDY REQUIRED'}
        </h1>
        <p className="text-gray-400 mb-8">
          {isPassed 
            ? 'Excellent work. You have demonstrated professional-level competency in this domain.' 
            : 'You were close. Review the technical explanations below to strengthen your knowledge.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="text-gray-500 text-sm mb-1">FINAL SCORE</div>
            <div className="text-3xl font-mono font-bold text-cyber-blue">{percentage}%</div>
          </div>
          <div className="glass-card p-6">
            <div className="text-gray-500 text-sm mb-1">ACCURACY</div>
            <div className="text-3xl font-mono font-bold text-cyber-blue">{score} / {questions.length}</div>
          </div>
          <div className="glass-card p-6">
            <div className="text-gray-500 text-sm mb-1">STATUS</div>
            <div className={cn(
              "text-3xl font-mono font-bold",
              isPassed ? "text-emerald-500" : "text-red-500"
            )}>
              {isPassed ? 'PASS' : 'FAIL'}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-cyber-blue" />
          Technical Review
        </h2>
        {questions.map((q, idx) => {
          const isCorrect = userAnswers[idx] === q.correctAnswer;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "glass-card p-6 border-l-4",
                isCorrect ? "border-l-emerald-500" : "border-l-red-500"
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <div className={cn(
                    "w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter border mb-1",
                    q.difficulty === 'Beginner' && "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
                    q.difficulty === 'Intermediate' && "text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5",
                    q.difficulty === 'Advanced' && "text-purple-400 border-purple-500/30 bg-purple-500/5"
                  )}>
                    {q.difficulty}
                  </div>
                  <h3 className="font-bold text-lg">{q.question}</h3>
                </div>
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-500">YOUR ANSWER:</div>
                <div className={cn(
                  "p-3 rounded bg-cyber-dark border border-cyber-border",
                  isCorrect ? "text-emerald-400" : "text-red-400"
                )}>
                  {userAnswers[idx] === -1 ? 'No answer provided' : q.options[userAnswers[idx]]}
                </div>
                {!isCorrect && (
                  <>
                    <div className="text-sm text-gray-500">CORRECT ANSWER:</div>
                    <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {q.options[q.correctAnswer]}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-cyber-blue/5 p-4 rounded-lg border border-cyber-blue/10">
                <div className="text-xs font-bold text-cyber-blue uppercase tracking-widest mb-2">Technical Rationale</div>
                <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 glass-card hover:border-cyber-blue text-cyber-blue font-bold flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          RETAKE EXAM
        </button>
        <button
          onClick={onHome}
          className="px-8 py-4 bg-cyber-blue text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
        >
          <Home className="w-5 h-5" />
          RETURN TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
