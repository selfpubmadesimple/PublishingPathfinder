// Test script to generate a sample PDF report
const { generateQuizReportPDF } = require('./server/pdf-service.ts');

// Sample quiz data for a children's book author
const sampleData = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  answers: [
    { questionId: 1, value: "children" },
    { questionId: 2, value: "writing" },
    { questionId: 3, value: "under_2000" },
    { questionId: 4, value: "beginner" },
    { questionId: 5, value: "less_than_2" },
    { questionId: 6, value: "hands_off" }
  ],
  allQuestions: [
    { id: 1, questionText: "What type of book are you writing?" },
    { id: 2, questionText: "What is your current status?" },
    { id: 3, questionText: "What is your estimated word count?" },
    { id: 4, questionText: "How would you describe your technical comfort level?" },
    { id: 5, questionText: "How much time can you commit to publishing tasks?" },
    { id: 6, questionText: "What is your preferred learning style?" }
  ],
  recommendedPath: {
    id: "hybrid-done-for-you",
    title: "Done-For-You Hybrid Publishing",
    description: "A comprehensive service where professionals handle all aspects of publishing while you maintain ownership and control of your work.",
    benefits: [
      "Professional editing and design services",
      "Maintain 100% ownership of your book",
      "Expert guidance throughout the process",
      "Access to established distribution networks",
      "Ongoing marketing support"
    ],
    reasons: [
      "Perfect for busy authors with limited time",
      "Ensures professional quality results",
      "Reduces risk of costly mistakes"
    ],
    nextSteps: [
      {
        title: "Complete Your Manuscript",
        description: "Focus on finishing your story while we prepare the publishing plan.",
        timeEstimate: "2-4 weeks"
      },
      {
        title: "Professional Editing Review",
        description: "Our editors will assess your manuscript and provide detailed feedback.",
        timeEstimate: "1-2 weeks"
      },
      {
        title: "Illustration Planning",
        description: "Work with our illustrators to plan the visual elements of your children's book.",
        timeEstimate: "3-4 weeks"
      },
      {
        title: "Publication & Launch",
        description: "Handle all technical aspects and launch your book across multiple platforms.",
        timeEstimate: "2-3 weeks"
      }
    ],
    alternatives: []
  },
  alternatives: [
    {
      id: "traditional",
      title: "Traditional Publishing",
      description: "Submit to publishers who cover all costs but retain most control and profits.",
      matchPercentage: 25,
      bestIf: "You have a truly exceptional manuscript and can wait 1-3 years"
    }
  ]
};

// Generate the PDF
console.log("Generating sample PDF report...");
try {
  const pdfBuffer = generateQuizReportPDF(sampleData);
  require('fs').writeFileSync('sample-report.pdf', pdfBuffer);
  console.log("Sample PDF report generated successfully as 'sample-report.pdf'");
} catch (error) {
  console.error("Error generating PDF:", error);
}