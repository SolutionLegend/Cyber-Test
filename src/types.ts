export type Category = 'Security+' | 'Network+' | 'Ethical Hacking' | 'General Cybersecurity' | 'Mixed Certification';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: Category;
  difficulty: Difficulty;
}

export interface QuizHistory {
  id: string;
  category: Category;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  timestamp: number;
  mode: 'Practice' | 'Exam';
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: number[];
  isFinished: boolean;
  score: number;
  startTime: number | null;
  endTime: number | null;
  mode: 'Practice' | 'Exam';
  requestedCategory: Category;
  difficulty: Difficulty;
  questionCount: number;
}
