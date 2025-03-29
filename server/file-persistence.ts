import fs from 'fs';
import path from 'path';
import { Article, User } from '@shared/schema';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

// Assicurati che la directory data esista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Carica i dati dal file system
export function loadUsers(): Map<number, User> {
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const users = JSON.parse(data);
      return new Map(Object.entries(users).map(([id, user]) => [Number(id), user as User]));
    } catch (error) {
      console.error('Errore durante il caricamento degli utenti:', error);
    }
  }
  return new Map();
}

export function loadArticles(): Map<number, Article> {
  if (fs.existsSync(ARTICLES_FILE)) {
    try {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
      const articles = JSON.parse(data);
      return new Map(Object.entries(articles).map(([id, article]) => [Number(id), article as Article]));
    } catch (error) {
      console.error('Errore durante il caricamento degli articoli:', error);
    }
  }
  return new Map();
}

// Salva i dati nel file system
export function saveUsers(users: Map<number, User>): void {
  try {
    const data = JSON.stringify(Object.fromEntries(users), null, 2);
    fs.writeFileSync(USERS_FILE, data);
  } catch (error) {
    console.error('Errore durante il salvataggio degli utenti:', error);
  }
}

export function saveArticles(articles: Map<number, Article>): void {
  try {
    const data = JSON.stringify(Object.fromEntries(articles), null, 2);
    fs.writeFileSync(ARTICLES_FILE, data);
  } catch (error) {
    console.error('Errore durante il salvataggio degli articoli:', error);
  }
}