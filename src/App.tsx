import React from 'react';
import { Category, Difficulty, Question, QuizState, QuizHistory } from './types';
import { generateQuestions } from './services/geminiService';
import { saveQuizResult, getQuizHistory } from './lib/storage';
import LandingPage from './components/LandingPage';
import QuizInterface from './components/QuizInterface';
import ResultsPage from './components/ResultsPage';
import { Loader2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = React.useState<'landing' | 'quiz' | 'results'>('landing');
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Consulting threat intelligence database...");
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<QuizHistory[]>([]);
  const [quizState, setQuizState] = React.useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    isFinished: false,
    score: 0,
    startTime: null,
    endTime: null,
    mode: 'Practice',
    requestedCategory: 'Security+',
    difficulty: 'Intermediate',
    questionCount: 10
  });

  React.useEffect(() => {
    setHistory(getQuizHistory());
  }, []);

  React.useEffect(() => {
    if (loading) {
      const messages = [
        "Consulting threat intelligence database...",
        "Analyzing attack vectors...",
        "Simulating breach scenarios...",
        "Synthesizing technical challenges...",
        "Finalizing exam environment..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleStartQuiz = async (category: Category, mode: 'Practice' | 'Exam', difficulty: Difficulty, questionCount: number) => {
    setLoading(true);
    setError(null);
    try {
      const questions = await generateQuestions(category, difficulty, questionCount);
      setQuizState({
        questions,
        currentQuestionIndex: 0,
        userAnswers: [],
        isFinished: false,
        score: 0,
        startTime: Date.now(),
        endTime: null,
        mode,
        requestedCategory: category,
        difficulty,
        questionCount
      });
      setView('quiz');
    } catch (err) {
      setError("Failed to generate exam questions. Please verify your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizState(prev => {
      const newState = {
        ...prev,
        score,
        userAnswers: answers,
        endTime: Date.now(),
        isFinished: true
      };
      
      // Save to history
      saveQuizResult({
        category: prev.requestedCategory,
        difficulty: prev.difficulty,
        score,
        totalQuestions: prev.questions.length,
        mode: prev.mode
      });
      
      // Refresh local history state
      setHistory(getQuizHistory());
      
      return newState;
    });
    setView('results');
  };

  const handleRestart = () => {
    handleStartQuiz(quizState.requestedCategory, quizState.mode, quizState.difficulty, quizState.questionCount);
  };

  const handleHome = () => {
    setView('landing');
  };

  return (
    <div className="min-h-screen cyber-grid flex flex-col">
      {/* Navigation / Header */}
      <header className="border-b border-cyber-border bg-cyber-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHome}>
            <div className="w-8 h-8 bg-cyber-blue rounded flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold tracking-tighter text-xl">CYBERSHIELD <span className="text-cyber-blue">PRO</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-cyber-blue transition-colors">RESOURCES</a>
            <a href="#" className="hover:text-cyber-blue transition-colors">COMMUNITY</a>
            <div className="h-4 w-[1px] bg-cyber-border" />
            <button className="text-cyber-blue border border-cyber-blue/30 px-4 py-1.5 rounded hover:bg-cyber-blue/10 transition-all">
              LOGIN
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            >
              <Loader2 className="w-12 h-12 text-cyber-blue animate-spin" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">GENERATING EXAM SCENARIOS</h2>
                <p className="text-gray-500 font-mono text-sm">{loadingMessage}</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-20 p-8 glass-card border-red-500/50 text-center"
            >
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">SYSTEM ERROR</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button 
                onClick={handleHome}
                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/20 transition-all"
              >
                RETURN TO DASHBOARD
              </button>
            </motion.div>
          ) : (
            <>
              {view === 'landing' && <LandingPage onStart={handleStartQuiz} history={history} />}
              {view === 'quiz' && (
                <QuizInterface 
                  questions={quizState.questions} 
                  mode={quizState.mode}
                  onComplete={handleQuizComplete}
                />
              )}
              {view === 'results' && (
                <ResultsPage 
                  questions={quizState.questions}
                  userAnswers={quizState.userAnswers}
                  score={quizState.score}
                  onRestart={handleRestart}
                  onHome={handleHome}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-cyber-border py-8 bg-cyber-dark/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2026 CyberShield Pro. All professional certification names are trademarks of their respective owners.
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-cyber-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyber-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyber-blue transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
