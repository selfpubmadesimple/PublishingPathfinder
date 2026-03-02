import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, reportRequestSchema } from "@shared/schema";
import { generateQuizReportPDF } from "./pdf-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get quiz questions
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  });

  // Save quiz results
  app.post("/api/quiz/results", async (req, res) => {
    try {
      console.log('Quiz results request body:', JSON.stringify(req.body, null, 2));
      const validatedResult = insertQuizResultSchema.parse(req.body);
      const savedResult = await storage.saveQuizResult(validatedResult);
      res.json(savedResult);
    } catch (error) {
      console.error('Quiz results validation error:', error);
      res.status(400).json({ error: "Invalid quiz result data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Get publishing paths
  app.get("/api/publishing-paths", async (req, res) => {
    try {
      const paths = await storage.getPublishingPaths();
      res.json(paths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch publishing paths" });
    }
  });

  // Request report generation with email
  app.post("/api/quiz/request-report", async (req, res) => {
    try {
      const validatedRequest = reportRequestSchema.parse(req.body);
      const updatedResult = await storage.updateQuizResultWithEmail(
        validatedRequest.sessionId,
        validatedRequest.email,
        validatedRequest.firstName,
        validatedRequest.lastName
      );
      
      if (!updatedResult) {
        return res.status(404).json({ error: "Quiz result not found" });
      }

      res.json({ success: true, message: "Report request saved successfully" });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Generate and download PDF report
  app.get("/api/quiz/report/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      // Get quiz result
      const quizResult = await storage.getQuizResult(sessionId);
      if (!quizResult || !quizResult.email) {
        return res.status(404).json({ error: "Quiz result not found or email not provided" });
      }

      // Get supporting data
      const [questions, publishingPaths] = await Promise.all([
        storage.getQuizQuestions(),
        storage.getPublishingPaths()
      ]);

      // Find recommended path and alternatives
      const recommendedPath = publishingPaths.find(p => p.id === quizResult.recommendedPath);
      if (!recommendedPath) {
        return res.status(404).json({ error: "Publishing path not found" });
      }

      const alternatives = publishingPaths.filter(p => p.id !== quizResult.recommendedPath);

      // Generate PDF
      const fullName = quizResult.firstName && quizResult.lastName 
        ? `${quizResult.firstName} ${quizResult.lastName}`
        : quizResult.firstName || quizResult.lastName || undefined;
        
      const reportData = {
        name: fullName,
        email: quizResult.email,
        answers: quizResult.answers as any[], // Type assertion for JSON field
        recommendedPath,
        allQuestions: questions,
        alternatives
      };

      const pdfBuffer = generateQuizReportPDF(reportData);

      // Mark as generated
      await storage.markReportGenerated(sessionId);

      // Send PDF response
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="publishing-path-report-${sessionId}.pdf"`,
        'Content-Length': pdfBuffer.length
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Report generation error:', error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
