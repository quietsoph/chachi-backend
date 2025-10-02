import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RouteHandler = (req: Request, res: Response) => Promise<void>;
export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export interface RouteConfig {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
  middleware?: Middleware[];
  auth?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
