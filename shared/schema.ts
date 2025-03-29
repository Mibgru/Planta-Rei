import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("isAdmin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  imageUrl: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  authorId: integer("authorId").references(() => users.id),
});

export const insertArticleSchema = createInsertSchema(articles)
  .pick({
    title: true,
    subtitle: true,
    description: true,
    content: true,
    imageUrl: true,
    authorId: true,
  })
  .extend({
    title: z.string().min(1, "Il titolo è obbligatorio").max(100, "Il titolo non può superare i 100 caratteri"),
    subtitle: z.string().min(1, "Il sottotitolo è obbligatorio").max(200, "Il sottotitolo non può superare i 200 caratteri"),
    description: z.string().min(1, "La descrizione è obbligatoria").max(500, "La descrizione non può superare i 500 caratteri"),
    content: z.string().nullable().optional(),
    imageUrl: z.string().url("Inserisci un URL valido per l'immagine"),
  });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
