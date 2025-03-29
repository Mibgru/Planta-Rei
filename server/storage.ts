import { type User, type InsertUser, type Article, type InsertArticle } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { loadUsers, loadArticles, saveUsers, saveArticles } from "./file-persistence";
import { db } from "./db";
import { users, articles } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

// Interfaccia per lo storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getLatestArticles(limit: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

// Implementazione con PostgreSQL
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Session store PostgreSQL
    const PostgresStore = connectPg(session);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Inizializza il database con l'utente admin se non esiste
    this.initDb();
  }

  private async initDb() {
    try {
      // Controlla se esiste già un utente admin
      const admin = await this.getUserByUsername("AdminPlantarei");
      
      if (!admin) {
        // Crea utente admin
        const adminPasswordHash = "c2d6aff3d9a1e7f2dc1dfe2c8e8e989b4e94a77ab2e0943486889b24c25cc4c9ad2327a8695ca9be54c84a15e75b54d6a2f20fcae5eb1cbdd7b95c3005f5560.cf83e1357eefb8bdf1542850d66d8007";
        
        // Inserisci prima l'utente
        const [user] = await db.insert(users)
          .values({
            username: "AdminPlantarei",
            password: adminPasswordHash
          })
          .returning();
        
        // Poi aggiorna manualmente is_admin
        if (user) {
          await db.update(users)
            .set({ isAdmin: true })
            .where(eq(users.id, user.id));
        }
        
        if (user) {
          // Controlla se ci sono articoli
          const articlesList = await this.getArticles();
          
          if (articlesList.length === 0) {
            // Aggiungi articoli di esempio
            const sampleArticles = [
              {
                title: "Tecniche di irrigazione sostenibile per risparmiare acqua",
                subtitle: "Risparmio idrico in agricoltura",
                description: "Scopri le moderne tecniche di irrigazione che permettono di ottimizzare l'uso dell'acqua mantenendo elevata la produttività delle colture. L'irrigazione a goccia, l'irrigazione per aspersione e altri metodi innovativi stanno trasformando il modo in cui gestiamo l'acqua nei campi.",
                imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                authorId: user.id,
              },
              {
                title: "Guida alla corretta fertilizzazione del terreno",
                subtitle: "Nutrire il suolo per colture sane",
                description: "Una fertilizzazione equilibrata è fondamentale per la salute delle piante. Ecco come pianificare un programma efficace per il tuo terreno, considerando i macro e micronutrienti necessari per ogni tipo di coltura e fase di crescita.",
                imageUrl: "https://images.unsplash.com/photo-1574943320219-5c1e677f23e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
                authorId: user.id,
              },
              {
                title: "Agricoltura di precisione: tecnologie e vantaggi",
                subtitle: "Il futuro dell'agricoltura è digitale",
                description: "L'agricoltura di precisione permette di ottimizzare gli interventi in campo. Ecco le tecnologie disponibili e i benefici economici e ambientali che possono portare alla tua azienda agricola, dal risparmio di input alla maggiore sostenibilità.",
                imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                authorId: user.id,
              }
            ];
            
            await Promise.all(sampleArticles.map(article => this.createArticle(article)));
          }
        }
      }
    } catch (error) {
      console.error("Errore durante l'inizializzazione del database:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, id));
    
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.username, username));
    
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users)
      .values({
        ...insertUser,
        // Nessun valore isAdmin qui, verrà impostato dal valore di default
      })
      .returning();
    
    return user;
  }
  
  // Article methods
  async getArticles(): Promise<Article[]> {
    return await db.select()
      .from(articles)
      .orderBy(desc(articles.createdAt));
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    const [article] = await db.select()
      .from(articles)
      .where(eq(articles.id, id));
    
    return article;
  }
  
  async getLatestArticles(limit: number): Promise<Article[]> {
    return await db.select()
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(limit);
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const now = new Date();
    
    const [article] = await db.insert(articles)
      .values({
        ...insertArticle,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    
    return article;
  }
  
  async updateArticle(id: number, articleUpdate: Partial<InsertArticle>): Promise<Article | undefined> {
    // Verifica se l'articolo esiste
    const existingArticle = await this.getArticleById(id);
    
    if (!existingArticle) {
      return undefined;
    }
    
    const [updatedArticle] = await db.update(articles)
      .set({
        ...articleUpdate,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    
    return updatedArticle;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });
    
    return result.length > 0;
  }
}

// Implementazione di MemStorage con persistenza su file
class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  public sessionStore: session.Store;
  
  private userCurrentId: number;
  private articleCurrentId: number;

  constructor() {
    // Carica i dati da file se esistono
    this.users = loadUsers();
    this.articles = loadArticles();
    
    // Determina gli ID correnti
    this.userCurrentId = this.users.size > 0 
      ? Math.max(...Array.from(this.users.keys())) + 1 
      : 1;
    
    this.articleCurrentId = this.articles.size > 0 
      ? Math.max(...Array.from(this.articles.keys())) + 1 
      : 1;
    
    // Configura il session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Se non ci sono utenti, aggiungi un admin predefinito
    if (this.users.size === 0) {
      // Pre-hash della password con un salt conosciuto per il testing
      const adminPasswordHash = "c2d6aff3d9a1e7f2dc1dfe2c8e8e989b4e94a77ab2e0943486889b24c25cc4c9ad2327a8695ca9be54c84a15e75b54d6a2f20fcae5eb1cbdd7b95c3005f5560.cf83e1357eefb8bdf1542850d66d8007";
      
      this.createUser({
        username: "AdminPlantarei",
        password: adminPasswordHash, // Password già pre-hashata con salt
      }).then(user => {
        // Aggiorna l'utente per farlo diventare admin
        const adminUser = { ...user, isAdmin: true };
        this.users.set(user.id, adminUser);
        saveUsers(this.users);
      });
    }
    
    // Se non ci sono articoli, aggiungi alcuni articoli di esempio
    if (this.articles.size === 0) {
      const sampleArticles = [
        {
          title: "Tecniche di irrigazione sostenibile per risparmiare acqua",
          subtitle: "Risparmio idrico in agricoltura",
          description: "Scopri le moderne tecniche di irrigazione che permettono di ottimizzare l'uso dell'acqua mantenendo elevata la produttività delle colture. L'irrigazione a goccia, l'irrigazione per aspersione e altri metodi innovativi stanno trasformando il modo in cui gestiamo l'acqua nei campi.",
          imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          authorId: 1,
        },
        {
          title: "Guida alla corretta fertilizzazione del terreno",
          subtitle: "Nutrire il suolo per colture sane",
          description: "Una fertilizzazione equilibrata è fondamentale per la salute delle piante. Ecco come pianificare un programma efficace per il tuo terreno, considerando i macro e micronutrienti necessari per ogni tipo di coltura e fase di crescita.",
          imageUrl: "https://images.unsplash.com/photo-1574943320219-5c1e677f23e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80",
          authorId: 1,
        },
        {
          title: "Agricoltura di precisione: tecnologie e vantaggi",
          subtitle: "Il futuro dell'agricoltura è digitale",
          description: "L'agricoltura di precisione permette di ottimizzare gli interventi in campo. Ecco le tecnologie disponibili e i benefici economici e ambientali che possono portare alla tua azienda agricola, dal risparmio di input alla maggiore sostenibilità.",
          imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
          authorId: 1,
        }
      ];
      
      Promise.all(sampleArticles.map(article => this.createArticle(article)));
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    
    // Salva i dati nel file system
    saveUsers(this.users);
    
    return user;
  }
  
  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getLatestArticles(limit: number): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleCurrentId++;
    const now = new Date();
    
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: now,
      updatedAt: now,
      authorId: insertArticle.authorId || null,
      content: insertArticle.content || null
    };
    
    this.articles.set(id, article);
    
    // Salva i dati nel file system
    saveArticles(this.articles);
    
    return article;
  }
  
  async updateArticle(id: number, articleUpdate: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    
    if (!article) {
      return undefined;
    }
    
    const updatedArticle: Article = {
      ...article,
      ...articleUpdate,
      content: articleUpdate.content !== undefined ? articleUpdate.content || null : article.content,
      updatedAt: new Date(),
    };
    
    this.articles.set(id, updatedArticle);
    
    // Salva i dati nel file system
    saveArticles(this.articles);
    
    return updatedArticle;
  }
  
  async deleteArticle(id: number): Promise<boolean> {
    const deleted = this.articles.delete(id);
    
    if (deleted) {
      // Salva i dati nel file system
      saveArticles(this.articles);
    }
    
    return deleted;
  }
}

// Esporta l'istanza dello storage
export const storage: IStorage = new DatabaseStorage();
