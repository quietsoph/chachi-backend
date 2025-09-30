import type { Middleware } from '../types/api';
import { ResponseHelper } from '../utils/responseHelper';

interface RateLimitStore {
  [key: string]: number[];
}

export const createRateLimit = (maxRequests: number, windowMs: number): Middleware => {
  const requests: RateLimitStore = {};

  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Initialize IP if not exists
    if (!requests[ip]) {
      requests[ip] = [];
    }

    // Filter recent requests within the time window
    const recentRequests = requests[ip].filter((time) => now - time < windowMs);

    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      ResponseHelper.error(res, 'Too many requests. Please try again later.', 429);
      return;
    }

    // Add current request timestamp
    recentRequests.push(now);
    requests[ip] = recentRequests;

    next();
  };
};
