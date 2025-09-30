import { Router } from 'express';
import type { RouteConfig, Middleware, RouteHandler } from '../types/api';
import { ResponseHelper } from './responseHelper';

export class RouteBuilder {
  private router: Router;
  private globalMiddleware: Middleware[] = [];
  private authMiddleware?: Middleware;

  constructor() {
    this.router = Router();
  }

  setGlobalMiddleware(middleware: Middleware[]): RouteBuilder {
    this.globalMiddleware = middleware;
    return this;
  }

  setAuthMiddleware(middleware: Middleware): RouteBuilder {
    this.authMiddleware = middleware;
    return this;
  }

  addRoute(config: RouteConfig): RouteBuilder {
    const middlewares = [...this.globalMiddleware];

    // Add route-specific middleware
    if (config.middleware) {
      middlewares.push(...config.middleware);
    }

    // Add auth middleware if required
    if (config.auth && this.authMiddleware) {
      middlewares.push(this.authMiddleware);
    }

    // Add the wrapped handler
    middlewares.push(this.wrapHandler(config.handler));

    // Register route
    this.router[config.method](config.path, ...middlewares);

    return this;
  }

  addRoutes(configs: RouteConfig[]): RouteBuilder {
    configs.forEach((config) => this.addRoute(config));
    return this;
  }

  build(): Router {
    return this.router;
  }

  private wrapHandler(handler: RouteHandler) {
    return async (req: any, res: any, next: any) => {
      try {
        await handler(req, res);
      } catch (error) {
        this.handleError(res, error);
      }
    };
  }

  private handleError(res: any, error: any): void {
    console.error('Route Error:', error);

    const status = error.status || error.statusCode || 500;
    const message = error.message || 'Internal server error';

    ResponseHelper.error(res, message, status);
  }
}
