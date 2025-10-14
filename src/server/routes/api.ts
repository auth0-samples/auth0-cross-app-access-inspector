import express from "express";
import { decodeJwt } from "jose";
import { decodeJwtHeader, decodeJwtSafely } from "../utils.js";

const router = express.Router();

// Middleware to check authentication
const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

router.post("/okta-token-exchange", requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const idToken = user?.idToken;

    if (!idToken) {
      return res.status(400).json({ error: "ID token not found in session" });
    }

    const response = await fetch(`${process.env.OKTA_ISSUER}/oauth2/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        client_id: process.env.OKTA_CLIENT_ID!,
        client_secret: process.env.OKTA_CLIENT_SECRET!,
        subject_token: idToken,
        subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
        requested_token_type: "urn:ietf:params:oauth:token-type:id-jag",
        audience: `https://${process.env.AUTH0_DOMAIN!}/`,
        ...(process.env.AUTH0_AUDIENCE && {
          resource: process.env.AUTH0_AUDIENCE,
        }),
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(async () => ({ error: response.text() }));
      console.error("Error making token exchange request to Okta:", error);
      return res.status(400).json(error);
    }

    const tokenData = await response.json();

    (req.session as any).idJagAssertion = tokenData.access_token;

    res.json({ success: true });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth0-jwt-bearer", requireAuth, async (req, res) => {
  try {
    const idJagAssertion = (req.session as any)?.idJagAssertion;

    if (!idJagAssertion) {
      return res
        .status(400)
        .json({ error: "ID-JAG assertion not found in session" });
    }

    const response = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          client_id: process.env.AUTH0_CLIENT_ID!,
          client_secret: process.env.AUTH0_CLIENT_SECRET!,
          assertion: idJagAssertion,
          ...(process.env.AUTH0_SCOPE && {
            scope: process.env.AUTH0_SCOPE,
          }),
        }),
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(async () => ({ error: response.text() }));
      console.error("Error making JWT Bearer exchange to Auth0:", error);
      return res.status(400).json(error);
    }

    const tokenData = await response.json();
    (req.session as any).accessToken = tokenData.access_token;
    res.json({ success: true });
  } catch (error) {
    console.error("Auth0 token exchange error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// WARNING: For demonstration purposes only.
// In a production environment, sensitive data like the ID-JAG assertion should NOT be exposed to the frontend.
router.get("/inspector-debug", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ isAuthenticated: false });
  }

  const user = req.user as any;
  const session = req.session as any;

  const idJagAssertionClaims = session?.idJagAssertion
    ? decodeJwtSafely(session.idJagAssertion)
    : null;
  const idJagAssertionHeader = session?.idJagAssertion
    ? decodeJwtHeader(session.idJagAssertion)
    : null;
  const accessTokenClaims = session?.accessToken
    ? decodeJwtSafely(session.accessToken)
    : null;
  const accessTokenHeader = session?.accessToken
    ? decodeJwtHeader(session.accessToken)
    : null;

  res.json({
    isAuthenticated: true,
    user: {
      email: user?.profile?.email,
      name: user?.profile?.name,
      id: user?.profile?.id,
      username: user?.profile?.username,
    },
    idToken: user?.idToken,
    idJagAssertion: session?.idJagAssertion,
    idJagAssertionClaims,
    idJagAssertionHeader,
    accessToken: session?.accessToken,
    accessTokenClaims,
    accessTokenHeader,
    oktaClientId: process.env.OKTA_CLIENT_ID,
    oktaIssuer: process.env.OKTA_ISSUER,
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0Audience: process.env.AUTH0_AUDIENCE,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0Scope: process.env.AUTH0_SCOPE,
  });
});

export default router;
