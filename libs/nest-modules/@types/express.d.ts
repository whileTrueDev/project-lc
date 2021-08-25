import { UserPayload } from '../src/lib/auth/auth.interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserPayload {}
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: UserPayload;
    };
  }
}
