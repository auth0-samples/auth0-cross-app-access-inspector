import 'express-session';

declare module 'express-session' {
  interface SessionData {
    idJagAssertion?: string;
    accessToken?: string;
  }
}

declare global {
  namespace Express {
    interface User {
      profile: any;
      idToken: string;
    }
  }
}
