import { UserProfileRes } from '@project-lc/shared-types';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserProfileRes {}
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user: UserProfileRes;
    };
  }
}
