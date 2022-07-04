import { NestMiddleware } from '@nestjs/common';
import { csrfkey } from '@project-lc/shared-types';
import { NextFunction, Request, Response } from 'express';
import { csrfFreeRoutes } from '../constants/csrf-free-routes';

export class CsrfTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    if (csrfFreeRoutes.includes(req.originalUrl)) {
      return next();
    }
    res.cookie(csrfkey, req.csrfToken());
    res.locals.csrfToken = req.csrfToken();
    return next();
  }
}
