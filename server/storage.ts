import { users, quizResults, type User, type InsertUser, QuizQuestion, QuizResult, InsertQuizResult, Question, PublishingPath, reportRequestSchema } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export interface IStorage {
  getQuizQuestions(): Promise<Question[]>;
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getPublishingPaths(): Promise<PublishingPath[]>;
  getQuizResult(sessionId: string): Promise<QuizResult | undefined>;
  updateQuizResultWithEmail(sessionId: string, email: string, firstName?: string, lastName?: string): Promise<QuizResult | undefined>;
  markReportGenerated(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private quizQuestions: Question[] = [];
  private publishingPaths: PublishingPath[] = [];

  constructor() {
    this.initializeQuizData();
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  private initializeQuizData() {
    this.quizQuestions = [
      {
        id: "0a",
        questionText: "What's your age group?",
        description: "Why we ask this: Different generations have different communication preferences and comfort levels with technology. This helps us tailor our guidance to speak your language.",
        questionType: "single",
        category: "demographics",
        order: 0.1,
        options: [
          { value: "under-35", label: "Under 35", description: "Digital native generation" },
          { value: "35-50", label: "35-50", description: "Established professional with growing families" },
          { value: "50-65", label: "50-65", description: "Experienced and looking to share wisdom" },
          { value: "over-65", label: "Over 65", description: "Mature author with stories to tell" }
        ]
      },
      {
        id: "0a2",
        questionText: "How comfortable are you with technology?",
        description: "Why we ask this: This helps us recommend the right level of hands-on involvement versus done-for-you services. No judgment - we work with authors across all comfort levels.",
        questionType: "single", 
        category: "tech-skills",
        order: 0.15,
        options: [
          { value: "very-comfortable", label: "Very Comfortable", description: "I enjoy learning new tech tools and figuring things out" },
          { value: "somewhat-comfortable", label: "Somewhat Comfortable", description: "I can handle basic tasks but prefer simple solutions" },
          { value: "prefer-guidance", label: "Prefer Guidance", description: "I'd rather have someone walk me through new technology" },
          { value: "hands-off", label: "Hands-Off Preferred", description: "I want professionals to handle the technical aspects" }
        ]
      },
      {
        id: "0b",
        questionText: "What's the working title of your book project?",
        description: "Why we ask this: Having your specific project in mind helps us provide personalized guidance in your report. Even if your title might change, this helps us understand your focus.",
        questionType: "text",
        category: "your-book",  
        order: 0.2,
        options: []
      },
      {
        id: "0c",
        questionText: "When do you hope to launch your book?",
        description: "Why we ask this: Your timeline affects which publishing path makes sense. Rushed timelines may limit your options, while flexible timelines open up more possibilities.",
        questionType: "single",
        category: "timeline",
        order: 0.3,
        options: [
          { value: "3-months", label: "Within 3 months", description: "I need to publish very soon" },
          { value: "6-months", label: "3-6 months", description: "I have a specific deadline coming up" },
          { value: "1-year", label: "6 months to 1 year", description: "I want to do this right with proper timeline" },
          { value: "flexible", label: "More than 1 year", description: "I'm flexible and want to focus on quality" },
          { value: "unsure", label: "I'm not sure yet", description: "I need guidance on realistic timelines" }
        ]
      },
      {
        id: "0d", 
        questionText: "How long have you been working on this book?",
        description: "This helps us understand where you are in your journey",
        questionType: "single",
        category: "timeline",
        order: 0.4,
        options: [
          { value: "just-started", label: "Just getting started", description: "I'm in the early brainstorming phase" },
          { value: "few-months", label: "A few months", description: "I've been working on it recently" },
          { value: "6-months", label: "About 6 months", description: "I've made solid progress" },
          { value: "1-year", label: "About a year", description: "I've been working steadily" },
          { value: "years", label: "More than a year", description: "This has been a long-term project" }
        ]
      },
      {
        id: "1",
        questionText: "What type of book are you planning to publish?",
        description: "This helps us understand your genre and target audience to provide more specific recommendations.",
        questionType: "single",
        category: "your-book",
        order: 1,
        options: [
          { value: "fiction", label: "Fiction", description: "Novels, short stories, poetry, and creative writing" },
          { value: "nonfiction", label: "Non-Fiction", description: "Memoirs, self-help, business, educational, or how-to books" },
          { value: "childrens", label: "Children's Book", description: "Picture books, middle grade, or young adult fiction" }
        ]
      },
      {
        id: "2",
        questionText: "What is your primary goal with publishing?",
        description: "Understanding your motivation helps us recommend the best path for your situation.",
        questionType: "single",
        category: "goals-preferences",
        order: 2,
        options: [
          { value: "income", label: "Generate Income", description: "I want to earn money from book sales" },
          { value: "sharing", label: "Share Knowledge/Story", description: "I want to share my message with the world" },
          { value: "credibility", label: "Build Credibility", description: "I want to establish myself as an expert" },
          { value: "legacy", label: "Leave a Legacy", description: "I want to create something lasting for family/community" }
        ]
      },
      {
        id: "3",
        questionText: "How much control do you want over the publishing process?",
        description: "This affects which publishing route will work best for you.",
        questionType: "single",
        category: "goals-preferences",
        order: 3,
        options: [
          { value: "full", label: "Complete Control", description: "I want to make all decisions about editing, design, and marketing" },
          { value: "collaborative", label: "Collaborative Control", description: "I want input but also professional guidance" },
          { value: "minimal", label: "Minimal Control", description: "I prefer professionals handle most decisions" }
        ]
      },
      {
        id: "4",
        questionText: "What is your budget for publishing?",
        description: "Why we ask this: Different publishing paths have different upfront costs. This helps us recommend options within your means and ensure you get the best value for your investment.",
        questionType: "single",
        category: "budget-resources",
        order: 4,
        options: [
          { value: "none", label: "No Budget", description: "I can't invest money upfront" },
          { value: "low", label: "Under $2,000", description: "I have a small budget for essentials" },
          { value: "medium", label: "$2,000 - $10,000", description: "I can invest in professional services" },
          { value: "high", label: "Over $10,000", description: "Budget is not a major concern" }
        ]
      },
      {
        id: "5",
        questionText: "What's your preferred learning style for new skills?",
        description: "Why we ask this: Different people learn best in different ways. This helps us recommend whether you'd prefer self-directed resources, guided courses, or full done-for-you services.",
        questionType: "single",
        category: "goals-preferences",
        order: 5,
        options: [
          { value: "independent", label: "Independent Learning", description: "I like to research and figure things out on my own" },
          { value: "group", label: "Group Learning", description: "I prefer courses, workshops, and community-based learning" },
          { value: "hands-off", label: "Hands-Off", description: "I prefer to have professionals handle it and give me regular updates" }
        ]
      },
      {
        id: "5b",
        questionText: "How comfortable are you with marketing and promotion?",
        description: "Why we ask this: Marketing requirements vary significantly between publishing options. This helps us match you with approaches that align with your marketing preferences.",
        questionType: "single",
        category: "goals-preferences",
        order: 5.5,
        options: [
          { value: "love", label: "I Love Marketing", description: "I enjoy promoting my work and building an audience" },
          { value: "learning", label: "I'm Learning", description: "I'm actively learning marketing but not an expert by any means" },
          { value: "dislike", label: "Prefer to Avoid", description: "I'd rather focus on writing and let others handle marketing" }
        ]
      },
      {
        id: "6",
        questionText: "How quickly do you want to publish?",
        description: "Why we ask this: Timeline expectations can help narrow down your best options and ensure we recommend realistic approaches that match your urgency level.",
        questionType: "single",
        category: "timeline",
        order: 6,
        options: [
          { value: "asap", label: "As Soon As Possible", description: "Within 3-6 months" },
          { value: "moderate", label: "Reasonable Timeline", description: "6 months to 1 year" },
          { value: "patient", label: "I Can Wait", description: "1-3 years for the right opportunity" }
        ]
      },
      {
        id: "7",
        questionText: "What is your target audience size?",
        description: "This helps determine the best distribution strategy for your book.",
        questionType: "single",
        category: "general",
        order: 7,
        options: [
          { value: "niche", label: "Niche Audience", description: "Specific community or specialized topic" },
          { value: "regional", label: "Regional/Local", description: "Local community or regional interest" },
          { value: "national", label: "National Market", description: "Broad appeal across the country" },
          { value: "global", label: "Global Market", description: "International audience potential" }
        ]
      },
      {
        id: "8",
        questionText: "Select the current phase you are in:",
        description: "Understanding your current phase helps us provide the most relevant next steps and timeline.",
        questionType: "single",
        category: "general",
        order: 8,
        options: [
          { value: "writing", label: "Writing", description: "Still working on my manuscript and content creation" },
          { value: "editing", label: "Editing", description: "Revising, proofreading, and refining my manuscript" },
          { value: "illustration", label: "Illustration", description: "Working on cover design, interior images, or book layout" },
          { value: "design-formatting", label: "Design/Formatting", description: "Finalizing book design, formatting, and print specifications" },
          { value: "publishing-launch", label: "Publishing/Launch", description: "Ready to publish and promote my finished book" }
        ]
      },
      {
        id: "9",
        questionText: "How many words is your book (or will it be)?",
        description: "Word count affects editing costs, printing costs, and market expectations.",
        questionType: "single",
        category: "general",
        order: 9,
        options: [
          { value: "under-2k", label: "Under 2,000 words", description: "Picture books, early readers, or short poetry" },
          { value: "2k-10k", label: "2,000 - 10,000 words", description: "Chapter books, short guides, or illustrated books" },
          { value: "10k-30k", label: "10,000 - 30,000 words", description: "Middle grade novels, business guides, or novellas" },
          { value: "30k-60k", label: "30,000 - 60,000 words", description: "Young adult novels or comprehensive non-fiction" },
          { value: "60k-90k", label: "60,000 - 90,000 words", description: "Standard adult novels or detailed non-fiction" },
          { value: "90k-120k", label: "90,000 - 120,000 words", description: "Long novels or comprehensive guides" },
          { value: "over-120k", label: "Over 120,000 words", description: "Epic novels or extensive reference works" }
        ]
      },
      {
        id: "10",
        questionText: "What's your technical comfort level?",
        description: "This helps us determine if coaching or done-for-you services would work better.",
        questionType: "single",
        category: "general",
        order: 10,
        options: [
          { value: "tech-savvy", label: "Very Tech-Savvy", description: "I can learn new software and processes quickly" },
          { value: "moderate", label: "Moderately Comfortable", description: "I can handle basic technology with some guidance" },
          { value: "basic", label: "Basic Skills", description: "I prefer simple, straightforward processes" },
          { value: "hands-off", label: "Prefer Hands-Off", description: "I'd rather have professionals handle technical aspects" }
        ]
      },
      {
        id: "11",
        questionText: "How many hours per week can you dedicate to your publishing project?",
        description: "Your available time helps determine if coaching or done-for-you services fit better.",
        questionType: "single",
        category: "general",
        order: 11,
        options: [
          { value: "under-2", label: "Less than 2 hours", description: "Very limited time, prefer done-for-you approach" },
          { value: "2-4", label: "2-4 hours", description: "Some time for guided work with coaching support" },
          { value: "over-4", label: "More than 4 hours", description: "Good availability for hands-on learning and involvement" }
        ]
      },
      {
        id: "12",
        questionText: "Can you name 3 books similar to yours that you'd compete with?",
        description: "Understanding your competition helps us recommend the right professionals for your genre. Include Amazon URLs if possible for better analysis.",
        questionType: "text",
        category: "general",
        order: 12
      },
      {
        id: "13",
        questionText: "Do you have an existing platform or following?",
        description: "Your existing audience can influence which publishing path works best.",
        questionType: "single",
        category: "general",
        order: 13,
        options: [
          { value: "large", label: "Large Following", description: "Over 10,000 followers/subscribers" },
          { value: "moderate", label: "Growing Platform", description: "1,000-10,000 followers" },
          { value: "small", label: "Small Platform", description: "Under 1,000 followers" },
          { value: "none", label: "No Platform", description: "Starting from scratch" }
        ]
      },
      {
        id: "14",
        questionText: "How do you want to handle book printing?",
        description: "Print-on-Demand (POD) means books are printed one at a time when ordered - no upfront costs or inventory. Traditional printing means ordering a bulk quantity upfront.",
        questionType: "single",
        category: "general",
        order: 14,
        options: [
          { value: "pod", label: "Print-on-Demand (POD)", description: "Books printed when ordered - no inventory, lower upfront costs" },
          { value: "bulk-small", label: "Print 100-500 copies", description: "Small bulk order for local sales, events, or testing" },
          { value: "bulk-medium", label: "Print 500-2000 copies", description: "Medium run for broader distribution and cost savings" },
          { value: "bulk-large", label: "Print 2000+ copies", description: "Large run for maximum cost per book savings" },
          { value: "unsure", label: "I'm not sure", description: "I need professional guidance on the best printing approach" }
        ]
      },
      {
        id: "15",
        questionText: "How many social media followers do you currently have?",
        description: "Your existing audience size helps determine the best marketing approach.",
        questionType: "single",
        category: "general",
        order: 15,
        options: [
          { value: "none", label: "Less than 100", description: "Just starting to build an online presence" },
          { value: "small", label: "100-1,000", description: "Growing but limited social reach" },
          { value: "moderate", label: "1,000-10,000", description: "Solid foundation for book marketing" },
          { value: "large", label: "10,000-50,000", description: "Strong platform for book promotion" },
          { value: "massive", label: "Over 50,000", description: "Significant influence and reach" }
        ]
      },
      {
        id: "16",
        questionText: "Which social media platforms are you actively using for your author presence?",
        description: "Check all platforms where you currently post book-related content, engage with readers, or plan to focus your marketing efforts. A platform is any place where you can build an audience and connect with potential readers.",
        questionType: "multiple",
        category: "general",
        order: 16,
        options: [
          { value: "facebook", label: "Facebook", description: "Author page, reader groups, and community building" },
          { value: "instagram", label: "Instagram", description: "Book photography, stories, and visual content" },
          { value: "twitter", label: "Twitter/X", description: "Writing updates, book discussions, and author networking" },
          { value: "linkedin", label: "LinkedIn", description: "Professional networking and thought leadership content" },
          { value: "tiktok", label: "TikTok/BookTok", description: "Short-form videos and book recommendations" },
          { value: "youtube", label: "YouTube", description: "Book trailers, author vlogs, and writing tutorials" },
          { value: "pinterest", label: "Pinterest", description: "Book covers, quotes, and visual inspiration boards" },
          { value: "goodreads", label: "Goodreads", description: "Author profile and direct reader engagement" },
          { value: "substack", label: "Substack/Newsletter Platform", description: "Email newsletter and subscriber content" },
          { value: "discord", label: "Discord", description: "Author community and reader discussion groups" },
          { value: "reddit", label: "Reddit", description: "Book communities and genre-specific discussions" },
          { value: "none", label: "I Don't Use Social Media", description: "Prefer other marketing methods" }
        ]
      },
      {
        id: "17",
        questionText: "What's your current website situation?",
        description: "Your website serves as your online headquarters where readers can learn about you and your books. Please provide your website URL if you have one.",
        questionType: "single",
        category: "general",
        order: 17,
        options: [
          { value: "professional", label: "Professional Author Website", description: "Custom domain, professional design, regularly updated with books/bio" },
          { value: "basic", label: "Basic Website", description: "Simple site but could use improvements or more content" },
          { value: "social-only", label: "Only Social Media Profiles", description: "Using Facebook, Instagram, or other platforms as main presence" },
          { value: "none-planning", label: "No, But Planning One", description: "I know I need one and want to create it" },
          { value: "none-unsure", label: "No, Not Sure If I Need One", description: "I'm uncertain about website necessity" }
        ]
      },
      {
        id: "17b",
        questionText: "If you have a website, please share the URL",
        description: "This helps us understand your current online presence and provide specific recommendations. Leave blank if you don't have a website yet.",
        questionType: "text",
        category: "general",
        order: 17.5,
        options: []
      },
      {
        id: "18",
        questionText: "How many email subscribers do you currently have?",
        description: "Email marketing is one of the most effective ways to sell books directly to your audience. This includes newsletter subscribers, mailing list members, or anyone who has given you permission to email them about your books.",
        questionType: "single",
        category: "general",
        order: 18,
        options: [
          { value: "none", label: "No Email List", description: "I haven't started building an email list yet" },
          { value: "small", label: "1-100 Subscribers", description: "Just beginning to collect emails" },
          { value: "growing", label: "100-1,000 Subscribers", description: "Building a solid foundation" },
          { value: "established", label: "1,000-5,000 Subscribers", description: "Strong email marketing potential" },
          { value: "large", label: "Over 5,000 Subscribers", description: "Excellent platform for book launches" }
        ]
      },
      {
        id: "18b",
        questionText: "When did you last send an email to your subscribers?",
        description: "Regular communication keeps your audience engaged and ready for your book launch. This helps us understand your current email marketing activity.",
        questionType: "single",
        category: "general",
        order: 18.5,
        options: [
          { value: "this-week", label: "This Week", description: "Very active with regular communication" },
          { value: "this-month", label: "Within the Last Month", description: "Good consistency in staying connected" },
          { value: "few-months", label: "2-3 Months Ago", description: "Could benefit from more regular communication" },
          { value: "long-time", label: "6+ Months Ago", description: "List may need re-engagement before book launch" },
          { value: "never", label: "Never/No Email List", description: "Haven't started email marketing yet" }
        ]
      },
      {
        id: "19",
        questionText: "How many people in your personal network are likely to support your book launch?",
        description: "Your personal connections can provide crucial initial momentum for book sales.",
        questionType: "single",
        category: "general",
        order: 19,
        options: [
          { value: "very-small", label: "Less than 25", description: "Limited personal network for initial support" },
          { value: "small", label: "25-100", description: "Some friends and family likely to buy" },
          { value: "moderate", label: "100-300", description: "Good personal network for launch momentum" },
          { value: "large", label: "300-1,000", description: "Strong personal connections for marketing" },
          { value: "massive", label: "Over 1,000", description: "Extensive network with significant reach" }
        ]
      },
      {
        id: "20",
        questionText: "What's your preferred learning style?",
        description: "Understanding how you like to learn helps us recommend the best support approach for you.",
        questionType: "single",
        category: "general",
        order: 20,
        options: [
          { value: "independent", label: "Independent Learning", description: "I prefer to research and figure things out on my own" },
          { value: "group", label: "Group Learning", description: "I learn best in courses, workshops, or with other authors" },
          { value: "hands-off", label: "Hands-Off", description: "I prefer professionals handle the details while keeping me informed" }
        ]
      },
      {
        id: "21",
        questionText: "What specific questions or concerns do you have about publishing?",
        description: "Tell us what you're most worried about so we can address these in your consultation.",
        questionType: "multiple",
        category: "general",
        order: 21,
        options: [
          { value: "cost-breakdown", label: "Detailed cost breakdown", description: "What will each step actually cost?" },
          { value: "timeline", label: "Realistic timeline", description: "How long will the whole process take?" },
          { value: "finding-professionals", label: "Finding the right professionals", description: "How do I find trustworthy editors, designers, illustrators?" },
          { value: "avoiding-scams", label: "Avoiding predatory publishers", description: "How do I spot and avoid publishing scams?" },
          { value: "marketing", label: "Marketing strategy", description: "How will I actually sell my book?" },
          { value: "distribution", label: "Distribution options", description: "Where and how will my book be available?" },
          { value: "rights-royalties", label: "Rights and royalties", description: "What rights do I keep and how much will I earn?" },
          { value: "technical-aspects", label: "Technical requirements", description: "What formats, ISBNs, and technical specs do I need?" },
          { value: "other", label: "Other concerns", description: "I have different questions or concerns not listed above" }
        ]
      },
      {
        id: "21b",
        questionText: "Please describe your other publishing questions or concerns",
        description: "Share any specific topics, questions, or worries about publishing that weren't covered in the previous list. This helps us provide more personalized guidance.",
        questionType: "text",
        category: "general",
        order: 21.5,
        options: []
      }
    ];

    this.publishingPaths = [
      {
        id: "self-publishing",
        title: "Self-Publishing",
        description: "Complete control over your book with direct access to readers and higher royalty rates.",
        benefits: [
          "Keep 35-70% royalties on sales (vs 8-15% traditional)",
          "Full creative and business control over content and pricing",
          "Fast time to market (3-6 months vs 2-3 years traditional)",
          "Own all rights to your work forever",
          "Direct relationship with readers and customer data"
        ],
        reasons: [
          "You have a moderate to large existing platform (1,000+ followers)",
          "You want complete control over your content, pricing, and timeline",
          "You're comfortable with marketing and promotion (or willing to learn)",
          "You have $2,000-$8,000 budget for professional services",
          "⚠️ WARNING: Avoid 'publishers' who ask YOU to pay them - these are often scams"
        ],
        nextSteps: [
          {
            title: "Complete Your Manuscript",
            description: "Ensure your book is fully written and self-edited before seeking professional help. Cost: $0-500 for writing software.",
            timeEstimate: "2-6 months"
          },
          {
            title: "Professional Editing (TOTAL: $2,600-$6,800)",
            description: "• Developmental editing: $1,500-$4,000 (big picture, structure, plot) • Copy editing: $800-$2,000 (grammar, style, flow) • Proofreading: $300-$800 (final typos, formatting) ⚠️ SCAM ALERT: Never pay upfront for all services. Legitimate editors work in stages.",
            timeEstimate: "1-3 months"
          },
          {
            title: "Cover Design & Interior (TOTAL: $500-$1,400)",
            description: "• Custom cover design: $300-$800 (avoid $50 templates - they hurt sales) • Interior formatting: $200-$600 for print & ebook • Illustrations (children's): $500-$3,000+ 🔍 RED FLAGS: Designers who won't show portfolio or demand full payment upfront",
            timeEstimate: "2-4 weeks"
          },
          {
            title: "Publishing Setup & Distribution (TOTAL: $125-$500)",
            description: "• ISBN: $125 (single) or $295 (10-pack) - never pay publishers $500+ for this • Platforms: Amazon KDP (free), IngramSpark ($49 setup), Draft2Digital (free) • Barcode: $25 or free from Bowker ⚠️ AVOID: Companies charging $1,000+ for 'distribution packages'",
            timeEstimate: "1-2 weeks"
          },
          {
            title: "TOTAL SELF-PUBLISHING COST: $3,225-$8,700",
            description: "💡 TRUSTED PROFESSIONALS: We maintain a vetted network of editors, designers, and illustrators who: • Show transparent pricing upfront • Provide references from past clients • Work in stages with milestone payments • Offer contracts protecting your rights",
            timeEstimate: "Get connected instantly"
          },
          {
            title: "Schedule Your Free Consultation",
            description: "Get personalized cost breakdowns for your specific word count and genre, plus introductions to pre-vetted professionals in our trusted network.",
            timeEstimate: "30 minutes"
          }
        ],
        alternatives: [
          {
            title: "Hybrid Publishing",
            description: "Professional support with shared investment and higher royalties than traditional.",
            matchPercentage: 75,
            bestIf: "You want professional help but more control than traditional publishing"
          },
          {
            title: "Traditional Publishing",
            description: "Publisher handles everything but you have less control and lower royalties.",
            matchPercentage: 40,
            bestIf: "You prefer a hands-off approach and have a strong platform"
          }
        ]
      },
      {
        id: "hybrid-publishing",
        title: "Done-For-You Hybrid Publishing",
        description: "Professional publishing service where we handle everything for you while keeping books under your own accounts. Get all the benefits of professional publishing without the hassle or risk of losing your rights.",
        benefits: [
          "You keep 100% of your royalties (35-70% vs 8-15% traditional)",
          "Professional editing, design, marketing, and publishing handled for you",
          "Books published under YOUR accounts - you retain all rights and control",
          "Personal guidance through every step of the process",
          "Access to vetted professionals and insider industry knowledge"
        ],
        reasons: [
          "You want professional results without doing the work yourself",
          "You have some budget but want maximum return on investment",
          "You prefer expert guidance over trial-and-error learning",
          "You value your time and want to focus on writing your next book",
          "You want to avoid the costly mistakes most first-time authors make"
        ],
        nextSteps: [
          {
            title: "Manuscript Evaluation",
            description: "Complete assessment of your manuscript's readiness and specific editing needs, plus genre-specific market positioning strategy.",
            timeEstimate: "1-2 weeks"
          },
          {
            title: "Cover Design",
            description: "Professional cover design that captures your book's essence and appeals to your target audience. We handle the entire process with vetted designers.",
            timeEstimate: "2-3 weeks"
          },
          {
            title: "Interior Formatting", 
            description: "Professional book formatting for both print and digital versions, ensuring your book meets industry standards and looks polished.",
            timeEstimate: "1-2 weeks"
          },
          {
            title: "Done-For-You Publishing Package",
            description: "We handle everything: ISBN registration, distribution setup across all major platforms, book metadata optimization - all under YOUR accounts so you retain full control.",
            timeEstimate: "2-3 weeks"
          },
          {
            title: "Marketing Support",
            description: "Strategic book launch plan leveraging your specific platform and social media presence to reach your target audience and maximize your book's success.",
            timeEstimate: "Ongoing support"
          }
        ],
        alternatives: [
          {
            title: "Self-Publishing",
            description: "Complete control but you handle all aspects of production and marketing yourself.",
            matchPercentage: 80,
            bestIf: "You have strong marketing skills and want maximum control"
          },
          {
            title: "Traditional Publishing",
            description: "Less upfront cost but longer timeline and less creative control.",
            matchPercentage: 60,
            bestIf: "You prefer minimal upfront investment and can wait longer"
          }
        ]
      },
      {
        id: "traditional-publishing",
        title: "Traditional Publishing",
        description: "Work with established publishers who handle all aspects of production, distribution, and marketing in exchange for most of the profits.",
        benefits: [
          "No upfront costs to you",
          "Professional editing, design, and marketing",
          "Wide distribution and bookstore placement",
          "Industry credibility and prestige",
          "Advance payment (if accepted)"
        ],
        reasons: [
          "You prefer minimal upfront investment (only editing costs $2,000-6,000)",
          "You have a strong platform (10,000+ engaged followers) or unique credentials",
          "Your book fits mainstream market appeal with broad commercial potential",
          "You're willing to wait 2-4 years for publication",
          "⚠️ REALITY CHECK: 98% of submissions are rejected. You need a compelling query and strong platform."
        ],
        nextSteps: [
          {
            title: "Perfect Your Manuscript ($2,000-$6,000 Investment)",
            description: "COST BREAKDOWN: • Developmental editing: $1,500-4,000 • Copy editing: $500-2,000 ⚠️ SCAM WARNING: Agents who charge reading fees are fake. Real agents only get paid when you do (15% commission).",
            timeEstimate: "6-12 months"
          },
          {
            title: "Query Letter & Agent Research ($25-$500)",
            description: "• QueryTracker.net: Free • Publishers Marketplace: $25/month • Professional query help: $200-500 🚨 RED FLAGS: Agents who guarantee publication, charge fees, or have no recent sales",
            timeEstimate: "2-4 weeks"
          },
          {
            title: "Submit to Agents (Expect 50-200+ Rejections)",
            description: "REALITY CHECK: • Top agents get 1,000+ queries/week • 98% rejection rate is normal • Average 6-18 months to find representation ✅ SIGNS OF GOOD AGENTS: Recent sales in your genre, member of AAR, client testimonials",
            timeEstimate: "6-18 months"
          },
          {
            title: "IF Accepted: Traditional Publishing Process",
            description: "WHAT TO EXPECT: • Advance: $1,000-$100,000+ (most debut authors get $5,000-15,000) • Royalties: 8-15% (vs 35-70% self-publishing) • Timeline: 18-36 months from contract to bookstore • Publisher pays all production costs",
            timeEstimate: "18-36 months"
          },
          {
            title: "Schedule Your Free Consultation",
            description: "Get proven strategies to strengthen your query letter, build your platform, and avoid the most common mistakes that lead to instant rejections.",
            timeEstimate: "30 minutes"
          }
        ],
        alternatives: [
          {
            title: "Hybrid Publishing",
            description: "Faster timeline with professional support but requires upfront investment.",
            matchPercentage: 70,
            bestIf: "You want professional support but faster publication"
          },
          {
            title: "Self-Publishing",
            description: "Complete control and higher royalties but you handle everything yourself.",
            matchPercentage: 45,
            bestIf: "You have marketing skills and want immediate publication"
          }
        ]
      }
    ];
  }

  async getQuizQuestions(): Promise<Question[]> {
    return [...this.quizQuestions];
  }

  async saveQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [savedResult] = await db
      .insert(quizResults)
      .values({
        ...result,
        createdAt: new Date()
      })
      .returning();
    return savedResult;
  }

  async getQuizResult(sessionId: string): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.sessionId, sessionId));
    return result || undefined;
  }

  async updateQuizResultWithEmail(sessionId: string, email: string, firstName?: string, lastName?: string): Promise<QuizResult | undefined> {
    const [updatedResult] = await db
      .update(quizResults)
      .set({ email, firstName, lastName })
      .where(eq(quizResults.sessionId, sessionId))
      .returning();
    return updatedResult || undefined;
  }

  async markReportGenerated(sessionId: string): Promise<void> {
    await db
      .update(quizResults)
      .set({ reportGenerated: true })
      .where(eq(quizResults.sessionId, sessionId));
  }

  async getPublishingPaths(): Promise<PublishingPath[]> {
    return [...this.publishingPaths];
  }
}

export const storage = new DatabaseStorage();
