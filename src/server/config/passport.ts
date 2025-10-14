import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";

// Configure the OpenID Connect strategy for Okta
passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: process.env.OKTA_ISSUER!,
      authorizationURL: `${process.env.OKTA_ISSUER}/oauth2/v1/authorize`,
      tokenURL: `${process.env.OKTA_ISSUER}/oauth2/v1/token`,
      userInfoURL: `${process.env.OKTA_ISSUER}/oauth2/v1/userinfo`,
      clientID: process.env.OKTA_CLIENT_ID!,
      clientSecret: process.env.OKTA_CLIENT_SECRET!,
      callbackURL: `${process.env.APP_BASE_URL}/login/callback`,
      scope: "openid profile email",
      skipUserProfile: true,
    },
    (
      issuer: string,
      profile: unknown,
      context: unknown,
      idToken: string,
      done: any,
    ) => {
      const user = {
        profile,
        idToken,
      };

      console.log("User object created:", {
        profile: user.profile,
        idToken: user.idToken
          ? "present (length: " + user.idToken.length + ")"
          : "missing",
      });

      return done(null, user);
    },
  ),
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
