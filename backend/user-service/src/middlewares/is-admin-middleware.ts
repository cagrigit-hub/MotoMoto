// middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../errors/forbidden-error";


export const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    if(req.user?.isAdmin === false) {
        throw new ForbiddenError('You are not authorized to perform this action');
    }
    next();
  
};
