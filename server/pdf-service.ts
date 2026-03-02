import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { QuizAnswer, PublishingPath, Question } from '@shared/schema';

interface ReportData {
  name?: string;
  email: string;
  answers: QuizAnswer[];
  recommendedPath: PublishingPath;
  allQuestions: Question[];
  alternatives: PublishingPath[];
}

// Helper function to get answer value by question text
function getAnswerByQuestion(answers: any[], questions: any[], questionText: string): any {
  const question = questions.find(q => q.questionText.includes(questionText));
  if (!question) return null;
  
  const answer = answers.find(a => a.questionId === question.id);
  return answer?.value || null;
}

// Helper function to generate personalized recommendation reasoning
function generateRecommendationReasoning(answers: any[], questions: any[], recommendedPath: any): string[] {
  const reasoning = [];
  
  const bookType = getAnswerByQuestion(answers, questions, "book are you writing");
  const currentStatus = getAnswerByQuestion(answers, questions, "current status");
  const wordCount = getAnswerByQuestion(answers, questions, "word count");
  const techComfort = getAnswerByQuestion(answers, questions, "technical");
  const timeCommitment = getAnswerByQuestion(answers, questions, "time");
  const learningStyle = getAnswerByQuestion(answers, questions, "learning");
  const budget = getAnswerByQuestion(answers, questions, "budget") || getAnswerByQuestion(answers, questions, "investment");
  
  // Reasoning based on path type
  if (recommendedPath.id.includes("hybrid") || recommendedPath.id.includes("done-for-you")) {
    reasoning.push("We recommended our done-for-you hybrid service because:");
    
    if (timeCommitment === "less_than_2") {
      reasoning.push("• You indicated limited time availability (less than 2 hours/week), making full-service support essential");
    }
    
    if (learningStyle === "hands_off") {
      reasoning.push("• Your preference for hands-off learning aligns perfectly with our comprehensive service model");
    }
    
    if (techComfort === "beginner") {
      reasoning.push("• Your technical comfort level suggests you'd benefit from professional handling of complex publishing tasks");
    }
    
    if (bookType === "children") {
      reasoning.push("• Children's books require specialized illustration and design expertise that our team provides");
    }
    
    reasoning.push("• You maintain 100% ownership while getting professional results");
    reasoning.push("• This approach minimizes your learning curve while maximizing quality outcomes");
  }
  
  if (recommendedPath.id.includes("traditional")) {
    reasoning.push("We suggested exploring traditional publishing because:");
    
    if (wordCount === "50000_plus") {
      reasoning.push("• Your substantial word count indicates a full-length work that publishers actively seek");
    }
    
    if (budget === "no_budget" || budget === "minimal") {
      reasoning.push("• Your current budget constraints make publisher-funded options attractive");
    }
    
    reasoning.push("• However, traditional publishing typically takes 1-3 years and has a 99% rejection rate");
    reasoning.push("• Most authors benefit from our hybrid approach for faster, more predictable results");
  }
  
  if (recommendedPath.id.includes("self")) {
    reasoning.push("We recommended self-publishing because:");
    
    if (learningStyle === "independent") {
      reasoning.push("• Your independent learning style suggests you'd enjoy managing the publishing process");
    }
    
    if (timeCommitment === "more_than_4") {
      reasoning.push("• You have sufficient time to learn and manage multiple publishing tasks");
    }
    
    if (techComfort === "advanced") {
      reasoning.push("• Your technical skills enable you to handle formatting, distribution, and marketing tools");
    }
  }
  
  return reasoning;
}

// Helper function to generate budget-conscious alternatives
function generateBudgetAlternatives(answers: any[], questions: any[]): any {
  const budget = getAnswerByQuestion(answers, questions, "budget") || getAnswerByQuestion(answers, questions, "investment");
  const bookType = getAnswerByQuestion(answers, questions, "book are you writing");
  
  if (budget === "under_2000" || budget === "1000_2000") {
    return {
      alternatives: [
        {
          service: "Editing",
          budgetOption: "Self-edit + proofreading only ($75)",
          warning: "Self-editing children's books is challenging - age-appropriate language and story structure require expertise"
        },
        {
          service: "Illustration", 
          budgetOption: "Simpler style illustrations ($65/image vs $250/image)",
          warning: "Simple doesn't mean amateur - professional simple illustrations still outperform DIY artwork"
        },
        {
          service: "Cover Design",
          budgetOption: "Pre-made cover ($100-200)",
          warning: "Pre-made covers may not perfectly fit your story and could be used by other authors. Custom covers ensure uniqueness"
        },
        {
          service: "Design/Formatting",
          budgetOption: "Template-based design ($300-500)",
          warning: "DIY formatting often looks unprofessional and can cause printing issues. Templates are a safer middle ground"
        },
        {
          service: "Marketing Support",
          budgetOption: "Basic virtual assistant ($8-$15/hour for simple tasks)",
          warning: "Lower-cost VAs may lack book marketing expertise. Specialized book marketers cost more but deliver better results"
        },
        {
          service: "Coordination",
          budgetOption: "Self-manage project timeline and vendors",
          warning: "Managing multiple vendors and timelines can be overwhelming for first-time authors. Coordination saves time and prevents costly mistakes"
        }
      ],
      warnings: [
        "DIY book covers often scream 'self-published' and hurt sales",
        "Poor formatting can make your book unreadable or unprintable", 
        "Pre-made covers may not match your story and could be used by multiple authors",
        "Investing in professional editing is non-negotiable for credibility",
        "Cheap marketing VAs may waste money without book industry knowledge",
        "Managing vendors without experience often leads to delays, miscommunication, and budget overruns"
      ]
    };
  }
  
  return null;
}

// Helper function to generate cost estimates
function generateCostEstimates(answers: any[], questions: any[], recommendedPath: any): any {
  const bookType = getAnswerByQuestion(answers, questions, "book are you writing");
  const wordCount = getAnswerByQuestion(answers, questions, "word count");
  const currentStatus = getAnswerByQuestion(answers, questions, "current status");
  
  let estimates = {
    editing: { range: "", description: "" },
    design: { range: "", description: "" },
    illustration: { range: "", description: "" },
    marketing: { range: "", description: "" },
    consultation: { range: "", description: "" },
    hourlyConsultation: { range: "", description: "" }
  };
  
  // Editing costs based on word count and book type
  if (bookType === "children" && wordCount === "under_2000") {
    estimates.editing = {
      range: "$425",
      description: "Children's book editing: $350 developmental editing + $75 proofreading for manuscripts under 1,000 words"
    };
  } else if (wordCount === "under_2000") {
    estimates.editing = {
      range: "$500-$800",
      description: "Short manuscript editing including developmental and copy editing"
    };
  } else if (wordCount === "2000_10000") {
    estimates.editing = {
      range: "$800-$2,000",
      description: "Short fiction/non-fiction editing including developmental and copy editing"
    };
  } else if (wordCount === "10000_30000") {
    estimates.editing = {
      range: "$1,500-$3,500",
      description: "Novella/short non-fiction editing including developmental, line, and copy editing phases"
    };
  } else if (wordCount === "30000_50000") {
    estimates.editing = {
      range: "$2,500-$5,000",
      description: "Standard novel/non-fiction editing with comprehensive developmental and copy editing"
    };
  } else {
    estimates.editing = {
      range: "$3,000-$8,000",
      description: "Full-length novel/comprehensive non-fiction editing including developmental, line, and copy editing"
    };
  }
  
  // Design costs
  if (bookType === "children") {
    estimates.design = {
      range: "$799",
      description: "Complete children's book formatting including ebook, paperback, and hardcover for both Amazon KDP and Ingram Spark"
    };
    estimates.illustration = {
      range: "$65-$250 per image",
      description: "Professional illustration pricing varies by style. Visit our illustration portfolio to see styles and select your preference for accurate pricing"
    };
  } else {
    estimates.design = {
      range: "$899 (cover $100-$500 + formatting $799)",
      description: "Professional book cover design and interior formatting for print and ebook"
    };
    estimates.illustration = {
      range: "$100-$250 per illustration",
      description: "Black and white interior illustrations for fiction/non-fiction (when needed)"
    };
  }
  
  // Marketing estimates
  estimates.marketing = {
    range: "$500-$2,500+ per month",
    description: "Virtual assistants ($8-$35/hour), social media managers ($15-$50/hour), specialized marketing/publicity services ($500-$2,500+ monthly). Evaluate experience and specialization carefully"
  };
  
  // Consultation and Done-For-You Service
  estimates.consultation = {
    range: "$2,000 coaching coordination",
    description: "20 hours of publishing coaching where April coordinates your entire book project, guides vendor selection, and manages timelines (does not include editing, design, or illustration costs)"
  };
  
  estimates.hourlyConsultation = {
    range: "$150-$300/hour",
    description: "Individual strategy sessions for specific questions and guidance"
  };
  
  return estimates;
}

// Helper function to determine publishing persona
function determinePublishingPersona(answers: any[], questions: any[]): { name: string, description: string } {
  const timeCommitment = getAnswerByQuestion(answers, questions, "time");
  const technicalComfort = getAnswerByQuestion(answers, questions, "technical");
  const learningStyle = getAnswerByQuestion(answers, questions, "learning");
  const marketingComfort = getAnswerByQuestion(answers, questions, "marketing") || "moderate";
  
  // Determine persona based on key characteristics
  if (learningStyle === "hands-off" || timeCommitment === "less-than-2") {
    return {
      name: "THE DELEGATOR",
      description: "You're results-focused and understand that your time is valuable. You prefer to work with trusted professionals who can handle the technical details while you focus on what you do best. You're smart enough to know when to delegate and invest in quality."
    };
  } else if (learningStyle === "independent" && (technicalComfort === "high" || technicalComfort === "proficient")) {
    return {
      name: "THE PIONEER", 
      description: "You're confident in your abilities and brave enough to blaze new trails. You enjoy learning and pushing yourself outside your comfort zone. You prefer to do your own research but appreciate guidance from experts. You're resourceful and work hard to be self-sufficient while being smart about where to invest."
    };
  } else if (learningStyle === "group" || marketingComfort === "learning") {
    return {
      name: "THE COLLABORATOR",
      description: "You thrive in community and love learning alongside others. You appreciate expert guidance but want to be actively involved in your publishing journey. You understand that the best results come from combining your unique vision with professional support and peer learning."
    };
  } else {
    return {
      name: "THE STRATEGIST",
      description: "You're thoughtful and methodical in your approach. You want professional results but also want to understand the process. You appreciate having options and like to make informed decisions based on expert recommendations tailored to your specific situation."
    };
  }
}

// Helper function to analyze user's situation with persona
function analyzeUserSituation(answers: any[], questions: any[]): string[] {
  const insights = [];
  const persona = determinePublishingPersona(answers, questions);
  
  // Add persona to insights
  insights.push(`Your Publishing Persona: ${persona.name}`);
  insights.push(`What That Means: ${persona.description}`);
  insights.push(""); // Add space
  
  // Analyze book type
  const bookType = getAnswerByQuestion(answers, questions, "book are you writing");
  if (bookType === "childrens") {
    insights.push("Children's books require specialized illustration and design - you'll need vetted illustrators who understand the unique requirements for this market.");
  } else if (bookType === "fiction") {
    insights.push("Fiction success depends on compelling storytelling AND professional presentation - cover design and editing can make or break your book's success.");
  } else if (bookType === "nonfiction") {
    insights.push("Non-fiction authors need strategic positioning to build authority - your book is your business card to the world.");
  }
  
  // Analyze current status with encouragement
  const currentStatus = getAnswerByQuestion(answers, questions, "current status");
  if (currentStatus === "writing") {
    insights.push("You're in the creative phase - the most exciting part! Focus on getting your story out, knowing that professional editing will polish your diamond later.");
  } else if (currentStatus === "editing") {
    insights.push("Smart move working on editing! Professional editing is where good books become great books - it's an investment in your success.");
  }
  
  // Analyze time commitment with realistic expectations
  const timeCommitment = getAnswerByQuestion(answers, questions, "time");
  if (timeCommitment === "less-than-2") {
    insights.push("With limited time, focus on what only you can do - your unique content and vision. Let professionals handle the technical complexity.");
  } else if (timeCommitment === "2-4") {
    insights.push("Your 2-4 hours per week is perfect for staying involved while having support for the heavy lifting. You can learn without being overwhelmed.");
  } else if (timeCommitment === "more-than-4") {
    insights.push("Your generous time commitment means you can be deeply involved if you want - or delegate more and focus on your next book!");
  }
  
  return insights;
}

export function generateQuizReportPDF(data: ReportData): Buffer {
  const doc = new jsPDF();
  let yPosition = 20;

  // Elegant Header Design for 50+ Women Authors
  // Background banner in soft purple/lavender
  doc.setFillColor(240, 235, 250); // Very light lavender
  doc.rect(10, 10, 190, 45, 'F');
  
  // Decorative border
  doc.setDrawColor(180, 150, 200); // Soft purple
  doc.setLineWidth(0.5);
  doc.rect(10, 10, 190, 45);
  
  // Title with elegant styling
  doc.setFontSize(18);
  doc.setTextColor(80, 60, 120); // Rich purple
  doc.text('Your Personal Publishing Path Report', 105, 25, { align: 'center' });
  
  // Subtitle with encouragement
  doc.setFontSize(12);
  doc.setTextColor(120, 100, 140); // Medium purple
  doc.text('Discover Your Perfect Path to Publishing Success', 105, 35, { align: 'center' });
  
  // Add decorative elements - simple flourishes
  doc.setDrawColor(200, 180, 220); // Light purple
  doc.setLineWidth(0.8);
  // Left flourish
  doc.line(30, 45, 50, 45);
  doc.circle(25, 45, 2);
  // Right flourish  
  doc.line(150, 45, 170, 45);
  doc.circle(175, 45, 2);
  
  yPosition = 65;

  // Personalization
  if (data.name) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Prepared for: ${data.name}`, 20, yPosition);
    yPosition += 10;
  }

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Email: ${data.email}`, 20, yPosition);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, yPosition);
  yPosition += 20;

  // Personalized Analysis Section with warm, encouraging tone
  const insights = analyzeUserSituation(data.answers, data.allQuestions);
  if (insights.length > 0) {
    // Add gentle background for persona section
    doc.setFillColor(252, 250, 255); // Very light purple tint
    doc.rect(15, yPosition - 5, 180, Math.max(insights.length * 6, 40), 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(80, 60, 120); // Rich purple to match header
    doc.text('✨ About You & Your Publishing Journey', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    insights.forEach(insight => {
      const wrappedInsight = doc.splitTextToSize(`• ${insight}`, 170);
      doc.text(wrappedInsight, 20, yPosition);
      yPosition += wrappedInsight.length * 4 + 4;
    });
    yPosition += 10;
  }

  // Why We Recommended This Path
  const reasoning = generateRecommendationReasoning(data.answers, data.allQuestions, data.recommendedPath);
  if (reasoning.length > 0) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(31, 81, 138);
    doc.text('🎯 Why We Recommended This Path', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    reasoning.forEach(reason => {
      const wrappedReason = doc.splitTextToSize(reason, 170);
      doc.text(wrappedReason, 20, yPosition);
      yPosition += wrappedReason.length * 4 + 4;
    });
    yPosition += 15;
  }

  // Recommended Path
  doc.setFontSize(16);
  doc.setTextColor(31, 81, 138);
  doc.text('🎯 Your Recommended Publishing Path', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(data.recommendedPath.title, 20, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const description = doc.splitTextToSize(data.recommendedPath.description, 170);
  doc.text(description, 20, yPosition);
  yPosition += description.length * 5 + 10;

  // Benefits
  doc.setFontSize(12);
  doc.setTextColor(31, 81, 138);
  doc.text('✅ Key Benefits:', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  data.recommendedPath.benefits.forEach((benefit) => {
    const wrappedBenefit = doc.splitTextToSize(`• ${benefit}`, 170);
    doc.text(wrappedBenefit, 25, yPosition);
    yPosition += wrappedBenefit.length * 4 + 2;
  });
  yPosition += 8;

  // Cost Estimates Section
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

  const costEstimates = generateCostEstimates(data.answers, data.allQuestions, data.recommendedPath);
  
  doc.setFontSize(16);
  doc.setTextColor(31, 81, 138);
  doc.text('💰 Realistic Cost Estimates', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Based on current industry rates and your specific project requirements:', 20, yPosition);
  yPosition += 8;

  Object.entries(costEstimates).forEach(([service, details]: [string, any]) => {
    if (details.range && details.range !== "Not typically needed") {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${service.charAt(0).toUpperCase() + service.slice(1)}: ${details.range}`, 20, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const description = doc.splitTextToSize(details.description, 165);
      doc.text(description, 25, yPosition);
      yPosition += description.length * 3.5 + 6;
    }
  });

  yPosition += 10;

  // Budget-Conscious Alternatives
  const budgetAlternatives = generateBudgetAlternatives(data.answers, data.allQuestions);
  if (budgetAlternatives) {
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(31, 81, 138);
    doc.text('💡 Budget-Conscious Alternatives', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Ways to reduce costs while maintaining quality:', 20, yPosition);
    yPosition += 8;

    budgetAlternatives.alternatives.forEach((alt: any) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${alt.service}: ${alt.budgetOption}`, 20, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setTextColor(180, 0, 0); // Red warning text
      const warning = doc.splitTextToSize(`⚠️ ${alt.warning}`, 165);
      doc.text(warning, 25, yPosition);
      yPosition += warning.length * 3.5 + 6;
    });

    yPosition += 5;
    doc.setFontSize(12);
    doc.setTextColor(180, 0, 0);
    doc.text('🚨 Important DIY Warnings:', 20, yPosition);
    yPosition += 6;

    budgetAlternatives.warnings.forEach((warning: string) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setTextColor(180, 0, 0);
      const wrappedWarning = doc.splitTextToSize(`• ${warning}`, 165);
      doc.text(wrappedWarning, 20, yPosition);
      yPosition += wrappedWarning.length * 3.5 + 4;
    });

    yPosition += 15;
  }

  // Next Steps
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(31, 81, 138);
  doc.text('📋 Your Next Steps', 20, yPosition);
  yPosition += 8;

  data.recommendedPath.nextSteps.forEach((step, index) => {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${step.title}`, 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const stepDesc = doc.splitTextToSize(step.description, 165);
    doc.text(stepDesc, 25, yPosition);
    yPosition += stepDesc.length * 3.5;

    doc.setTextColor(100, 100, 100);
    doc.text(`⏱️ Time: ${step.timeEstimate}`, 25, yPosition);
    yPosition += 8;
  });

  // Free Resources Section
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(16);
  doc.setTextColor(31, 81, 138);
  doc.text('🎁 Your Free Resources', 20, yPosition);
  yPosition += 15;

  const resources = [
    {
      title: 'Publishing Scam Detection Guide',
      description: 'Comprehensive guide with red flags checklist, questions to ask, and how to verify legitimate publishers using Writer Beware database.'
    },
    {
      title: 'Professional Editor Vetting Checklist',
      description: 'Step-by-step guide to finding qualified editors including interview questions, sample edit requests, and rate verification.'
    },
    {
      title: 'Book Cover Design Brief Template',
      description: 'Professional template to communicate your vision clearly to designers, ensuring you get covers that sell books.'
    },
    {
      title: 'ISBN and Copyright Registration Guide',
      description: 'Complete walkthrough of protecting your intellectual property and obtaining necessary publishing identifiers.'
    },
    {
      title: 'Book Launch Timeline Template',
      description: 'Month-by-month planning guide for successful book launches, including marketing milestones and promotional strategies.'
    },
    {
      title: 'Publishing Contract Review Checklist',
      description: 'Essential questions and red flags when reviewing any publishing agreement. Protect your rights and avoid costly mistakes.'
    },
    {
      title: 'Genre-Specific Marketing Strategies',
      description: 'Tailored marketing approaches for fiction, non-fiction, and children\'s books with platform-specific tactics.'
    },
    {
      title: 'Marketing Team Evaluation Guide',
      description: 'Questions to ask when hiring VAs, social media managers, and marketing specialists. Includes red flags and experience verification tips.'
    },
    {
      title: 'Illustration Style Portfolio & Pricing',
      description: 'Browse our illustrators\' portfolios and select your preferred style to get accurate pricing for your children\'s book project.'
    },
    {
      title: 'DIY vs Professional Quality Guide',
      description: 'Visual examples showing the difference between professional and DIY work, helping you make informed budget decisions.'
    },
    {
      title: 'Free 30-Minute Strategy Consultation',
      description: 'Personal consultation to review your specific manuscript, timeline, and goals. Get customized recommendations for your unique situation.'
    }
  ];

  resources.forEach((resource) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(31, 81, 138);
    doc.text(`📖 ${resource.title}`, 20, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const resourceDesc = doc.splitTextToSize(resource.description, 170);
    doc.text(resourceDesc, 25, yPosition);
    yPosition += resourceDesc.length * 4 + 8;
  });

  // Call to Action
  yPosition += 10;
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(31, 81, 138);
  doc.text('🚀 Ready to Get Started?', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('Schedule your free 30-minute consultation to:', 20, yPosition);
  yPosition += 6;

  const ctaItems = [
    'Review your specific manuscript and goals',
    'Get a personalized action plan with timelines',
    'Connect with vetted professionals in your genre',
    'Avoid costly mistakes that delay publication',
    'Access exclusive resources and insider knowledge'
  ];

  ctaItems.forEach((item) => {
    doc.setFontSize(10);
    doc.text(`✓ ${item}`, 25, yPosition);
    yPosition += 5;
  });

  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(31, 81, 138);
  doc.text('📧 Reply to this email to schedule your call', 20, yPosition);
  doc.text('💬 Or visit: https://aprilcox.com/consult', 20, yPosition + 6);

  // Quiz Answers Summary (New Page)
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(16);
  doc.setTextColor(31, 81, 138);
  doc.text('📝 Your Quiz Answers', 20, yPosition);
  yPosition += 15;

  data.answers.forEach((answer) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    const question = data.allQuestions.find(q => q.id === answer.questionId);
    if (!question) return;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const questionText = doc.splitTextToSize(`Q: ${question.questionText}`, 170);
    doc.text(questionText, 20, yPosition);
    yPosition += questionText.length * 4 + 3;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    if (question.questionType === 'text') {
      const answerText = doc.splitTextToSize(`A: ${Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}`, 165);
      doc.text(answerText, 25, yPosition);
      yPosition += answerText.length * 3.5 + 6;
    } else {
      const selectedOptions = question.options?.filter(opt => 
        Array.isArray(answer.value) 
          ? answer.value.includes(opt.value)
          : opt.value === answer.value
      );
      
      selectedOptions?.forEach(option => {
        doc.text(`A: ${option.label}`, 25, yPosition);
        yPosition += 4;
      });
      yPosition += 4;
    }
  });

  return Buffer.from(doc.output('arraybuffer'));
}