import { Response } from 'express';
import type { ApiResponse } from '../types/api';

export class ResponseHelper {
  static success<T>(res: Response, data?: T, message?: string, status: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data && { data })
    };
    res.status(status).json(response);
  }

  static created<T>(res: Response, data?: T, message?: string): void {
    this.success(res, data, message, 201);
  }

  static error(res: Response, message: string, status: number = 400): void {
    const response: ApiResponse = {
      success: false,
      error: message
    };
    res.status(status).json(response);
  }

  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Authentication required'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Access denied'): void {
    this.error(res, message, 403);
  }

  static serverError(res: Response, message: string = 'Internal server error'): void {
    this.error(res, message, 500);
  }
}
