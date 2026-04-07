import { QuizHistory } from '../types';

const STORAGE_KEY = 'cybershield_quiz_history';

export const saveQuizResult = (result: Omit<QuizHistory, 'id' | 'timestamp'>) => {
  const history = getQuizHistory();
  const newEntry: QuizHistory = {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50 attempts
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return newEntry;
};

export const getQuizHistory = (): QuizHistory[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse quiz history', e);
    return [];
  }
};

export const clearQuizHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
