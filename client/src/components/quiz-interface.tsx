import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Question, QuizAnswer, InsertQuizResult, PublishingPath } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { calculateRecommendedPath } from "@/lib/quiz-logic";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface QuizInterfaceProps {
  onComplete: (answers: QuizAnswer[]) => void;
  sessionId: string;
  userEmail: string;
  userName: string;
}

export default function QuizInterface({ onComplete, sessionId, userEmail, userName }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const { toast } = useToast();

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['/api/quiz/questions'],
  });

  const { data: publishingPaths } = useQuery<PublishingPath[]>({
    queryKey: ['/api/publishing-paths'],
  });

  const saveResultMutation = useMutation({
    mutationFn: async (result: InsertQuizResult) => {
      const response = await apiRequest('POST', '/api/quiz/results', result);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz'] });
    },
  });

  if (questionsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary">No questions available. Please try again later.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Section headers for better organization
  const getSectionTitle = (category: string) => {
    const sectionTitles = {
      "about-you": "👋 About You",
      "your-book": "📚 Your Book Project", 
      "timeline": "⏰ Timeline & Progress",
      "goals-preferences": "🎯 Goals & Preferences",
      "budget-resources": "💰 Budget & Resources",
      "skills-experience": "🛠️ Skills & Experience",
      "marketing-platform": "📢 Marketing & Platform",
      "concerns": "❓ Questions & Concerns"
    };
    return sectionTitles[category as keyof typeof sectionTitles] || "";
  };

  const isFirstQuestionInSection = () => {
    if (currentQuestionIndex === 0) return true;
    return questions[currentQuestionIndex].category !== questions[currentQuestionIndex - 1].category;
  };

  // Explanatory text for why we ask each type of question
  const getWhyWeAskText = (category: string) => {
    const explanations = {
      "about-you": "By understanding your background and preferences, we can recommend approaches that match your comfort level and communication style.",
      "your-book": "Knowing your book's details helps us suggest genre-specific strategies and connect you with the right professionals.",
      "timeline": "Understanding your timeline helps us recommend realistic paths and prioritize the most urgent next steps.",
      "goals-preferences": "Your goals and preferences help us match you with the publishing approach that aligns with what matters most to you.",
      "budget-resources": "Budget information ensures we recommend options within your means and help you plan realistic investment levels.",
      "skills-experience": "Your technical comfort level helps us determine whether coaching, done-for-you services, or hybrid approaches work best.",
      "marketing-platform": "By understanding your current platform, we can suggest marketing strategies that build on your existing strengths.",
      "concerns": "Your specific questions help us provide personalized guidance and address your most important worries."
    };
    return explanations[category as keyof typeof explanations] || "";
  };

  const handleAnswerChange = (value: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({
      questionId: currentQuestion.id,
      value
    });
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz complete
      if (publishingPaths && publishingPaths.length > 0) {
        const recommendedPath = calculateRecommendedPath(answers, publishingPaths);
        
        try {
          const nameParts = userName?.split(' ') || [];
          await saveResultMutation.mutateAsync({
            sessionId,
            answers,
            recommendedPath,
            email: userEmail,
            firstName: nameParts[0] || undefined,
            lastName: nameParts.slice(1).join(' ') || undefined
          });
        } catch (error) {
          toast({
            title: "Error saving results",
            description: "Your results couldn't be saved, but you can still view them.",
            variant: "destructive",
          });
        }
      }
      
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const hasAnswer = currentAnswer && (
    (typeof currentAnswer.value === 'string' && currentAnswer.value) ||
    (Array.isArray(currentAnswer.value) && currentAnswer.value.length > 0)
  );

  return (
    <>
      {/* Fixed Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-secondary font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-primary font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Quiz Content */}
      <div className="quiz-interface pt-24">
        {/* Question Card */}
        <div className="bg-surface rounded-lg shadow-material-2 p-8">
          {/* Section Header */}
          {isFirstQuestionInSection() && (
            <div className="mb-6 pb-4 border-b border-purple-200">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                {getSectionTitle(currentQuestion.category)}
              </h2>
              <p className="text-sm text-gray-600">
                {getWhyWeAskText(currentQuestion.category)}
              </p>
            </div>
          )}
          
          <div className="mb-6">
          <h2 className="font-roboto-slab text-2xl font-semibold text-primary mb-3">
            {currentQuestion.questionText}
          </h2>
          {currentQuestion.description && (
            <p className="text-secondary">
              {currentQuestion.description}
            </p>
          )}
          </div>

          {/* Question Options */}
          <div className="space-y-4">
            {currentQuestion.questionType === 'single' && currentQuestion.options && (
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => (
                  <label 
                    key={option.value}
                    className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer 
                              hover:border-primary hover:bg-blue-50 transition-all group"
                  >
                    <input 
                      type="radio" 
                      name={`question-${currentQuestion.id}`} 
                      value={option.value}
                      checked={currentAnswer?.value === option.value}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="mt-1 text-primary" 
                    />
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-secondary">{option.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'multiple' && currentQuestion.options && (
              <div className="grid gap-3">
                {currentQuestion.options.map((option) => (
                  <label 
                    key={option.value}
                    className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer 
                              hover:border-primary hover:bg-blue-50 transition-all group"
                  >
                    <input 
                      type="checkbox" 
                      value={option.value}
                      checked={Array.isArray(currentAnswer?.value) && currentAnswer.value.includes(option.value)}
                      onChange={(e) => {
                        const currentValues = Array.isArray(currentAnswer?.value) ? currentAnswer.value : [];
                        if (e.target.checked) {
                          handleAnswerChange([...currentValues, option.value]);
                        } else {
                          handleAnswerChange(currentValues.filter(v => v !== option.value));
                        }
                      }}
                      className="mt-1 text-primary" 
                    />
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-secondary">{option.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'text' && (
              <>
                {currentQuestion.id === "17b" ? (
                  <input
                    type="url"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="https://your-website.com"
                    value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                ) : (
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    rows={4}
                    placeholder={
                      currentQuestion.id === "12" 
                        ? "Example:\nBook Title 1 - https://amazon.com/dp/...\nBook Title 2 - https://amazon.com/dp/...\nBook Title 3 - https://amazon.com/dp/..."
                        : "Enter your answer..."
                    }
                    value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                )}
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center text-secondary hover:text-primary transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Previous
            </button>
            
            <button 
              onClick={handleNext}
              disabled={!hasAnswer || saveResultMutation.isPending}
              className="bg-primary hover:bg-primaryDark text-white font-medium py-2 px-6 rounded-lg 
                         transition-colors shadow-material-1 hover:shadow-material-2 flex items-center
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveResultMutation.isPending ? (
                "Saving..."
              ) : currentQuestionIndex === questions.length - 1 ? (
                <>
                  Complete Quiz
                  <i className="fas fa-check ml-2"></i>
                </>
              ) : (
                <>
                  Next
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Why We Ask This Section - Only show if NOT first in section */}
        {!isFirstQuestionInSection() && (
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mt-6 rounded-r-lg">
            <div className="flex items-start">
              <i className="fas fa-lightbulb text-purple-600 mt-0.5 mr-3"></i>
              <div>
                <h3 className="font-medium text-purple-600 mb-1">Why we ask this</h3>
                <p className="text-sm text-gray-700">
                  {getWhyWeAskText(currentQuestion.category)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
