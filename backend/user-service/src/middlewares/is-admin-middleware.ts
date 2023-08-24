// middlewares/isAdmin.ts
import { Request, Response, NextFunction } from 'express';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if the user is an admin
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).json({ error: 'Unauthorized' }); // User is not an admin
  }
};


// req.user doesnt exists so add

