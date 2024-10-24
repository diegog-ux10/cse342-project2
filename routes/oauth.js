const router = require('express').Router();
const passport = require('passport');

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

module.exports = router;