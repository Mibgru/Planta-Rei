import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertArticleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Articles API endpoints
  app.get("/api/articles", async (_req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/latest", async (_req, res) => {
    try {
      const limit = parseInt(_req.query.limit as string) || 5;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }

      const article = await storage.getArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Protected routes - require authentication
  app.post("/api/articles", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse({
        ...req.body,
        authorId: req.user!.id
      });
      
      const newArticle = await storage.createArticle(validatedData);
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data", error });
    }
  });

  app.put("/api/articles/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }

      const article = await storage.getArticleById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Partial validation of update data
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const updatedArticle = await storage.updateArticle(id, validatedData);
      res.json(updatedArticle);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data", error });
    }
  });

  app.delete("/api/articles/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }

      const success = await storage.deleteArticle(id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is an admin
function isAdmin(req: Request, res: Response, next: Function) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}
