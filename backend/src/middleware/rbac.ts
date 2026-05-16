import { Response, NextFunction } from 'express';
import { UserRole, AuthRequest } from '../types';
import { sendError } from '../utils/response';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}.`,
        403
      );
      return;
    }
    next();
  };
};
