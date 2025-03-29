import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Setting session secret either from env or fallback to a default (in development only)
  const sessionSecret = process.env.SESSION_SECRET || "agristudio-secret-key";
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        // Verifica speciale per l'amministratore predefinito
        if (username === "AdminPlantarei" && password === "PlantaRei25@@" && user) {
          return done(null, user);
        }
        
        // Altre credenziali vengono verificate normalmente
        if (!user || !(user.password.includes(".") && await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username già in uso" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: SelectUser) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Username o password non validi" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Debug per verificare che la sessione sia stata creata correttamente
        console.log("Login successful, session ID:", req.sessionID);
        console.log("User in session:", req.user);
        
        // Aggiungiamo un ritardo per garantire che la sessione venga salvata
        setTimeout(() => {
          res.status(200).json(user);
        }, 100);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    if (req.session) {
      console.log("Logout, destroying session:", req.sessionID);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout effettuato con successo" });
      });
    } else {
      res.status(200).json({ message: "Nessuna sessione da terminare" });
    }
  });

  app.get("/api/user", (req, res) => {
    console.log("GET /api/user - isAuthenticated:", req.isAuthenticated(), "- sessionID:", req.sessionID);
    if (req.isAuthenticated() && req.user) {
      console.log("Utente autenticato:", req.user);
      return res.json(req.user);
    }
    return res.status(401).json({ message: "Non autenticato" });
  });
}
