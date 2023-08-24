// middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import ForbiddenError from "src/errors/forbidden-error";

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
