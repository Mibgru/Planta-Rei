import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { users, articles } from "@shared/schema";

async function runMigrations() {
  // Crea un client sql per il database Neon
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  
  console.log("🔄 Esecuzione delle migrazioni...");
  
  try {
    // Crea la tabella users se non esiste
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        "is_admin" BOOLEAN NOT NULL DEFAULT FALSE
      )
    `;
    
    console.log("✅ Tabella utenti creata!");
    
    // Crea la tabella articles se non esiste
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        "image_url" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "author_id" INTEGER REFERENCES users(id)
      )
    `;
    
    console.log("✅ Tabella articoli creata!");
    console.log("✅ Migrazioni completate con successo!");
  } catch (error) {
    console.error("❌ Errore durante l'esecuzione delle migrazioni:", error);
    process.exit(1);
  }
}

// Esegui le migrazioni
runMigrations();