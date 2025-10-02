import type { Middleware } from '../types/api';
import { ResponseHelper } from '../utils/responseHelper';
import { verifyToken } from '../utils/jwtToken';

export const createAuthMiddleware = (): Middleware => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        ResponseHelper.unauthorized(res, 'Access token required');
        return;
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        ResponseHelper.forbidden(res, 'Invalid or expired token');
        return;
      }

      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      ResponseHelper.forbidden(res, 'Invalid token');
    }
  };
};
