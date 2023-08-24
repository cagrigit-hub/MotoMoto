// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/app-error';


export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    // Custom app-specific errors
    res.status(error.statusCode).json({ error: error.message });
  } else {
    // Generic error handling
    console.error('Unhandled Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
