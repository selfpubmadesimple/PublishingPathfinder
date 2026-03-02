import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReportRequestFormProps {
  sessionId: string;
  onRequestSubmitted: () => void;
}

export function ReportRequestForm({ sessionId, onRequestSubmitted }: ReportRequestFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive the report.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/quiz/request-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          email,
          name: name || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit report request');
      }

      toast({
        title: "Success!",
        description: "Your report request has been saved. You can now download your personalized report.",
      });

      onRequestSubmitted();
    } catch (error) {
      console.error('Report request error:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    window.open(`/api/quiz/report/${sessionId}`, '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-roboto-slab text-primary flex items-center justify-center">
          <i className="fas fa-file-pdf mr-3"></i>
          Get Your Personalized Publishing Report
        </CardTitle>
        <CardDescription className="text-lg">
          Download a comprehensive PDF with your quiz answers, personalized recommendations, 
          publishing guidance, scam warnings, and valuable free resources.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-white/80 rounded-lg p-4 border border-primary/10">
          <h4 className="font-semibold text-primary mb-3 flex items-center">
            <i className="fas fa-gift mr-2"></i>
            What You'll Get in Your Report:
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Your personalized publishing path recommendation</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Expert guidance and realistic timelines</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Step-by-step action plan with deadlines</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Scam detection guide and red flag warnings</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Free resources worth $500+ in value</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-check text-green-500 text-xs mt-1.5 mr-2 flex-shrink-0"></i>
                <span>Complete record of your quiz answers</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll only use your email to send your report and occasional helpful publishing tips.
            </p>
          </div>
          
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Name (Optional)
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name for personalization"
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving Information...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save & Get Report
                </>
              )}
            </Button>
            
            {sessionId && (
              <Button 
                type="button" 
                variant="outline"
                onClick={handleDownloadReport}
                className="flex-1 border-primary text-primary hover:bg-primary/5"
              >
                <i className="fas fa-download mr-2"></i>
                Download Report
              </Button>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Your information is secure and will never be shared with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}