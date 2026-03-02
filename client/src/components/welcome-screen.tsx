import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@assets/Untitled design - 2025-07-22T061906.055_1753179565883.png";

interface WelcomeScreenProps {
  onStartQuiz: (email: string, name?: string) => void;
}

export default function WelcomeScreen({ onStartQuiz }: WelcomeScreenProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && firstName.trim() && lastName.trim()) {
      onStartQuiz(email.trim(), `${firstName.trim()} ${lastName.trim()}`);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="bg-surface rounded-lg shadow-material-2 p-8 text-center max-w-2xl mx-auto">
        {/* Hero Image */}
        <div className="mb-6 flex justify-center">
          <img 
            src={heroImage}
            alt="Author writing in warm evening light"
            className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        <h1 className="font-roboto-slab text-3xl font-semibold text-primary mb-4">
          Find Your Perfect Publishing Path:<br />Take the Quiz!
        </h1>
        <p className="text-gray-600 text-lg mb-4 leading-relaxed">
          Ready to publish but not sure where to start? Take our quick, personalized quiz for expert guidance tailored to your unique journey.
        </p>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          Get clear, professional recommendations, avoid costly publishing mistakes, and connect with resources you can trust—so you can confidently bring your dream book to life - without the nightmares.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-background p-4 rounded-lg flex flex-col items-center text-center h-full">
            <i className="fas fa-calculator text-primary text-2xl mb-3"></i>
            <h3 className="font-medium mb-2 min-h-[2.5rem] flex items-center">Publishing Guidance</h3>
            <p className="text-sm text-gray-600">Get expert guidance to answer your questions</p>
          </div>
          <div className="bg-background p-4 rounded-lg flex flex-col items-center text-center h-full">
            <i className="fas fa-shield-alt text-primary text-2xl mb-3"></i>
            <h3 className="font-medium mb-2 min-h-[2.5rem] flex items-center">Avoid Scams</h3>
            <p className="text-sm text-gray-600">Learn to spot scams and connect with trusted professionals</p>
          </div>
          <div className="bg-background p-4 rounded-lg flex flex-col items-center text-center h-full">
            <i className="fas fa-calendar-check text-primary text-2xl mb-3"></i>
            <h3 className="font-medium mb-2 min-h-[2.5rem] flex items-center">Free Consultation</h3>
            <p className="text-sm text-gray-600">Get personalized guidance for your specific book</p>
          </div>
        </div>
        
        {!showForm ? (
          <button 
            onClick={handleGetStarted}
            className="bg-primary hover:bg-primaryDark text-white font-medium py-3 px-8 rounded-lg 
                       transition-colors shadow-material-1 hover:shadow-material-2 text-lg"
          >
            <i className="fas fa-play mr-2"></i>
            Start Your Publishing Journey
          </button>
        ) : (
          <form onSubmit={handleStartQuiz} className="max-w-md mx-auto space-y-4">
            <div className="text-left">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-left">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                  className="mt-1"
                />
              </div>
              <div className="text-left">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div className="text-left">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="For consultation scheduling"
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primaryDark"
              >
                <i className="fas fa-play mr-2"></i>
                Begin Quiz
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
