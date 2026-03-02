import { useState } from "react";
import WelcomeScreen from "@/components/welcome-screen";
import QuizInterface from "@/components/quiz-interface";
import ResultsScreen from "@/components/results-screen";
import { QuizAnswer } from "@shared/schema";
import { generateSessionId } from "@/lib/quiz-logic";

type QuizScreen = 'welcome' | 'quiz' | 'results';

export default function Quiz() {
  const [currentScreen, setCurrentScreen] = useState<QuizScreen>('welcome');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [sessionId] = useState(() => generateSessionId());
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const handleStartQuiz = (email: string, name?: string) => {
    setUserEmail(email);
    setUserName(name || '');
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (quizAnswers: QuizAnswer[]) => {
    setAnswers(quizAnswers);
    setCurrentScreen('results');
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-material-1 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-book-open text-white text-lg"></i>
              </div>
              <h1 className="font-roboto-slab font-semibold text-xl text-primary">Publishing Path Finder</h1>
            </div>
            {currentScreen !== 'welcome' && (
              <button 
                onClick={handleRestart}
                className="text-secondary hover:text-primary transition-colors"
              >
                <i className="fas fa-redo-alt"></i>
                <span className="ml-2 hidden sm:inline">Restart</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {currentScreen === 'welcome' && (
          <WelcomeScreen onStartQuiz={handleStartQuiz} />
        )}
        
        {currentScreen === 'quiz' && (
          <QuizInterface 
            onComplete={handleQuizComplete}
            sessionId={sessionId}
            userEmail={userEmail}
            userName={userName}
          />
        )}
        
        {currentScreen === 'results' && (
          <ResultsScreen 
            answers={answers}
            sessionId={sessionId}
            userEmail={userEmail}
            userName={userName}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-question-circle mr-1"></i>
                FAQ
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-envelope mr-1"></i>
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <i className="fas fa-shield-alt mr-1"></i>
                Privacy
              </a>
            </div>
            <p className="text-sm">
              © 2025 Publishing Path Finder. Helping authors navigate their publishing journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
