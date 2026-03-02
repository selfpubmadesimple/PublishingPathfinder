import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  description: text("description"),
  questionType: text("question_type").notNull(), // 'single', 'multiple', 'text'
  options: jsonb("options"), // Array of option objects
  category: text("category").notNull(), // 'general', 'fiction', 'nonfiction', 'childrens', 'about-you', 'your-book', 'timeline', 'goals-preferences', 'budget-resources', 'demographics', 'tech-skills'
  order: integer("order").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  email: text("email"), // Optional email for report delivery
  firstName: text("first_name"), // First name for personalization
  lastName: text("last_name"), // Last name for personalization
  answers: jsonb("answers").notNull(),
  recommendedPath: text("recommended_path").notNull(),
  reportGenerated: boolean("report_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
  reportGenerated: true,
});

// Schema for collecting user info for report delivery
export const reportRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  sessionId: z.string(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

// Types for quiz logic
export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  questionText: string;
  description?: string;
  questionType: 'single' | 'multiple' | 'text';
  options?: QuestionOption[];
  category: 'general' | 'fiction' | 'nonfiction' | 'childrens' | 'about-you' | 'your-book' | 'timeline' | 'goals-preferences' | 'budget-resources' | 'demographics' | 'tech-skills';
  order: number;
}

export interface PublishingPath {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  reasons: string[];
  nextSteps: Array<{
    title: string;
    description: string;
    timeEstimate: string;
  }>;
  alternatives: Array<{
    title: string;
    description: string;
    matchPercentage: number;
    bestIf: string;
  }>;
}

export interface QuizAnswer {
  questionId: string;
  value: string | string[];
}
