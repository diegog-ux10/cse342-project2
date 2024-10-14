const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getDb } = require('../database/database');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    const db = getDb();
    try {
      let user = await db.collection('users').findOne({ googleId: profile.id });
      if (!user) {
        user = await db.collection('users').insertOne({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          createdAt: new Date()
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const db = getDb();
  try {
    const user = await db.collection('users').findOne({ _id: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;