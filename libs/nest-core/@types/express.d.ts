import { UserPayload } from '../src/lib/interfaces/auth.interface';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserPayload {
      email?: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: UserPayload;
    };
  }
}
