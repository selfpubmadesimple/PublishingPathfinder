import { useQuery } from "@tanstack/react-query";
import { QuizAnswer, PublishingPath } from "@shared/schema";
import { calculateRecommendedPath } from "@/lib/quiz-logic";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportRequestForm } from "./report-request-form";
import { useState } from "react";

interface ResultsScreenProps {
  answers: QuizAnswer[];
  sessionId: string;
  userEmail: string;
  userName: string;
  onRestart: () => void;
}

export default function ResultsScreen({ answers, sessionId, userEmail, userName, onRestart }: ResultsScreenProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const { data: publishingPaths, isLoading } = useQuery<PublishingPath[]>({
    queryKey: ['/api/publishing-paths'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!publishingPaths || publishingPaths.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary">Unable to load publishing recommendations. Please try again.</p>
        <button onClick={onRestart} className="mt-4 text-primary hover:underline">
          Restart Quiz
        </button>
      </div>
    );
  }

  const recommendedPathId = calculateRecommendedPath(answers, publishingPaths);
  const recommendedPath = publishingPaths.find(path => path.id === recommendedPathId);
  const alternativePaths = publishingPaths.filter(path => path.id !== recommendedPathId);

  if (!recommendedPath) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary">Unable to determine your publishing path. Please try again.</p>
        <button onClick={onRestart} className="mt-4 text-primary hover:underline">
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="results-screen">
      {/* Results Header */}
      <div className="bg-surface rounded-lg shadow-material-2 p-8 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h2 className="font-roboto-slab text-3xl font-semibold text-primary mb-3">
            Your Publishing Path is Ready!
          </h2>
          <p className="text-secondary text-lg">
            Based on your answers, we've identified the perfect publishing strategy for your book.
          </p>
        </div>
      </div>

      {/* Recommended Path */}
      <div className="bg-surface rounded-lg shadow-material-2 p-8 mb-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-star text-white"></i>
          </div>
          <div>
            <h3 className="font-roboto-slab text-2xl font-semibold text-primary mb-2">
              {recommendedPath.title}
            </h3>
            <p className="text-secondary text-lg">
              {recommendedPath.description}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-accent mb-3 flex items-center">
              <i className="fas fa-thumbs-up mr-2"></i>
              Perfect For You Because:
            </h4>
            <ul className="space-y-2">
              {recommendedPath.reasons.map((reason, index) => (
                <li key={index} className="flex items-start text-sm">
                  <i className="fas fa-circle text-accent text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3 flex items-center">
              <i className="fas fa-chart-line mr-2"></i>
              Key Benefits:
            </h4>
            <ul className="space-y-2">
              {recommendedPath.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start text-sm">
                  <i className="fas fa-check text-primary text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Scam Alert Section */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-material-2 p-6 mb-6">
        <h3 className="font-roboto-slab text-xl font-semibold text-red-700 mb-4 flex items-center">
          <i className="fas fa-shield-alt mr-3"></i>
          🚨 Protect Yourself from Publishing Scams
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-red-700 mb-3">⚠️ RED FLAGS - AVOID THESE:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <i className="fas fa-times-circle text-red-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Companies asking YOU to pay them to publish (Writer Beware, the industry watchdog, warns about vanity publishers that charge authors fees while operating as traditional publishers)</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-times-circle text-red-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Agents charging reading fees or upfront costs</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-times-circle text-red-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Promises of bestseller status or guaranteed sales</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-times-circle text-red-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>No physical address, poor communication, or pressure tactics</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-3">✅ LEGITIMATE SIGNS:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Transparent about services and processes</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Portfolio of past work and client references</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Milestone payments, not everything upfront</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Professional contracts protecting your rights</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-surface rounded-lg shadow-material-2 p-8 mb-6">
        <h3 className="font-roboto-slab text-xl font-semibold text-primary mb-4 flex items-center">
          <i className="fas fa-list-check mr-3"></i>
          Your Recommended Publishing Path
        </h3>
        
        <div className="space-y-4">
          {recommendedPath.nextSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-background rounded-lg">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{step.title}</h4>
                <p className="text-secondary text-sm mb-2">
                  {step.description}
                </p>
                <div className="flex items-center text-xs text-accent">
                  <i className="fas fa-clock mr-1"></i>
                  Estimated: {step.timeEstimate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Options */}
      <div className="bg-surface rounded-lg shadow-material-2 p-8 mb-6">
        <h3 className="font-roboto-slab text-xl font-semibold text-primary mb-4 flex items-center">
          <i className="fas fa-route mr-3"></i>
          Alternative Paths to Consider
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {recommendedPath.alternatives.map((alternative, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-center mb-2">
                <i className="fas fa-user text-primary mr-2"></i>
                <h4 className="font-semibold">{alternative.title}</h4>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded">
                  {alternative.matchPercentage}% Match
                </span>
              </div>
              <p className="text-sm text-secondary mb-2">
                {alternative.description}
              </p>
              <div className="text-xs text-accent">Best if: {alternative.bestIf}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Request Form */}
      {showReportForm && (
        <div className="mb-6">
          <ReportRequestForm 
            sessionId={sessionId} 
            onRequestSubmitted={() => setShowReportForm(false)}
          />
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-primaryDark rounded-lg shadow-material-2 p-8 mb-6 text-white">
        <div className="text-center">
          <h3 className="font-roboto-slab text-2xl font-semibold mb-3">
            Ready to Take the Next Step?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Get personalized guidance on costs, timelines, and finding trusted professionals for your specific book. 
            Avoid predatory publishers and get connected with vetted editors, designers, and illustrators.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <i className="fas fa-calculator text-2xl mb-2"></i>
              <h4 className="font-medium mb-1">Personalized Consultation</h4>
              <p className="text-sm opacity-80">Get expert guidance tailored to your specific book and goals</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <i className="fas fa-shield-alt text-2xl mb-2"></i>
              <h4 className="font-medium mb-1">Avoid Scams</h4>
              <p className="text-sm opacity-80">Learn to spot and avoid predatory publishers</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <i className="fas fa-users text-2xl mb-2"></i>
              <h4 className="font-medium mb-1">Trusted Professionals</h4>
              <p className="text-sm opacity-80">Get connected with vetted editors and designers</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.open('https://aprilcox.com/consult', '_blank')}
            className="bg-accent hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg 
                       transition-colors shadow-material-1 hover:shadow-material-2 text-lg"
          >
            <i className="fas fa-calendar-check mr-2"></i>
            Book Your FREE 30-Minute Consultation
          </button>
          
          <p className="text-sm mt-3 opacity-75">
            No sales pitch - just honest guidance to help you succeed
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={onRestart}
          className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white 
                     font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <i className="fas fa-redo-alt mr-2"></i>
          Take Quiz Again
        </button>
        
        <button 
          onClick={() => window.open(`/api/quiz/report/${sessionId}`, '_blank')}
          className="w-full sm:w-auto bg-accent hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg 
                     transition-colors shadow-material-1 hover:shadow-material-2 flex items-center justify-center"
        >
          <i className="fas fa-file-pdf mr-2"></i>
          Download PDF Report
        </button>
      </div>
    </div>
  );
}
