function isAuthenticated(req, res, next) {
  // Debug logging
  console.log('Checking authentication:', {
      hasSession: !!req.session,
      hasSessionUser: !!(req.session && req.session.user),
      hasIsAuthenticated: !!req.isAuthenticated,
      isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });

  // Check multiple authentication methods
  if (
      // Check session user
      (req.session && req.session.user) ||
      // Check passport authentication
      (req.isAuthenticated && req.isAuthenticated()) ||
      // Check user object
      req.user
  ) {
      return next();
  }

  // If using API routes
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ 
          message: 'You must be logged in to access this resource',
          success: false
      });
  }

  // If using web routes, redirect to login
  res.redirect('/login');
}

module.exports = isAuthenticated;