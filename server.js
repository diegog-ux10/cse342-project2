const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { initDb } = require('./database/database');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

// Load environment variables first
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. Essential middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10kb' }));

// 2. Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https://github.com', 'https://*.githubusercontent.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
    },
  }
}));

// 3. CORS configuration (before session)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',')
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 3600
};
app.use(cors(corsOptions));

// 4. Session configuration (before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'default',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  proxy: true // Add this if behind a reverse proxy
}));

// 5. Passport initialization (after session)
app.use(passport.initialize());
app.use(passport.session());

// 6. Passport configuration
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log('Authentication callback received');
    console.log('GitHub profile:', profile);
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user);
  done(null, user);
});

// 7. View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// 8. Debug middleware (optional, but helpful)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Session:', {
      id: req.sessionID,
      user: req.session.user,
      authenticated: req.isAuthenticated ? req.isAuthenticated() : false
    });
    next();
  });
}

// 9. Routes
app.get('/', (req, res) => {
  console.log('User data in req:', req.user);
  res.render('index', { 
    user: req.session.user || req.user
  });
});

// 10. Main routes
app.use('/', routes);

// 11. Error handler (should be last)
app.use(errorHandler);

// Database initialization and server start
initDb((err, db) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');

  // Error handling for uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});