// middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../errors/forbidden-error";
declare global {
  namespace Express {
      interface Request {
      user: any;
      }
  }
}


export const isAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ForbiddenError();
  }
};
