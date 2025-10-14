import express from "express";
import session from "express-session";
import passport from "passport";
import ViteExpress from "vite-express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', authRoutes);
app.use('/api', apiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

const port = parseInt(process.env.PORT || '3000', 10);

if (process.env.NODE_ENV === 'production') {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
} else {
  ViteExpress.listen(app, port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
}
