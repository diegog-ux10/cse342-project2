// server.js
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { initDb } = require('./database/database');
const helmet = require('helmet'); // Add this dependency
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1); // Trust the first proxy
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https://github.com', 'https://*.githubusercontent.com'], // Add GitHub domains
      scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
    },
  }
}));

// Session configuration with security best practices
app.use(session({
  secret: process.env.SESSION_SECRET || 'default',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  proxy: true // Trust the reverse proxy
}));

app.use((req, res, next) => {
  console.log('Session:', {
    id: req.sessionID,
    user: req.session.user,
    authenticated: req.isAuthenticated()
  });
  next();
});

// Body parser configuration with size limits
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  maxAge: 3600
};

app.use(cors(corsOptions));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL:  process.env.CALLBACK_URL,  // Hardcode temporarily for testing
  passReqToCallback: true  // Add this to get more context
},
  function (request, accessToken, refreshToken, profile, done) {
    console.log('Authentication callback received');
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  // Store minimal user data
  const sessionUser = {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  };
  console.log('Serializing user:', sessionUser);
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  console.log('Deserializing user:', sessionUser);
  done(null, sessionUser);
});

app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.get('/', (req, res) => {
  console.log('Home route - Session:', {
    id: req.sessionID,
    user: req.session.user,
    authenticated: req.isAuthenticated()
  });
  
  res.render('index', { 
    user: req.session.user || null 
  });
});

// Database initialization and server start
initDb((err, db) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');

  app.use('/', routes);
  app.use(errorHandler);

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