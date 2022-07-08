import { csrfkey, csrfSecretKey } from '@project-lc/shared-types';
import csrf from 'csurf';

export const csrfConfig: Parameters<typeof csrf>[0] = {
  cookie: { key: csrfSecretKey },
  value: (req) => req.cookies[csrfkey],
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
};
