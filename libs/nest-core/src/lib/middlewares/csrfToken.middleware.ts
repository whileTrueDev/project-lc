import { NestMiddleware } from '@nestjs/common';
import { csrfkey } from '@project-lc/shared-types';
import { NextFunction, Request, Response } from 'express';

export class CsrfTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.cookie(csrfkey, req.csrfToken());
    res.locals.csrfToken = req.csrfToken();
    next();
  }
}
