const router = require('express').Router();
const passport = require('passport');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Explicitly set user in session
    req.session.user = {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName
    };
    
    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      res.redirect('/');
    });
  }
);

module.exports = router;