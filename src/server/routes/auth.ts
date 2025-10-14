import express from "express";
import passport from "passport";

const router = express.Router();

// Login route - initiates OIDC authentication with Okta
router.get('/login', passport.authenticate('openidconnect'));

// Callback route - handles the redirect from Okta
router.get('/login/callback',
  passport.authenticate('openidconnect', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Session destroy error:', destroyErr);
      }
      res.redirect('/');
    });
  });
});

export default router;
