import { NextFunction, Request } from 'express';
import { RequestHandler, Response } from 'express-serve-static-core';

export function wrapRouteAction(action: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await action(req, res, next);
    } catch (e) {
      return next(e);
    }
  };
}
