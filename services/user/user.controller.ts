import { Router, Response, Request } from 'express';

import { PrismaClient } from '../../generated/prisma';
import { UserService } from './user.service';
import { RouteBuilder } from '../../shared/utils/routeBuilder';
import { createAuthMiddleware } from '../../shared/middlewares/auth';
import { createRateLimit } from '../../shared/middlewares/rateLimit';
import { LoginRequest, RegisterRequest, UserUpdateData } from './user.types';
import { ResponseHelper } from '../../shared/utils/responseHelper';
import USER_SERVICE from '../../shared/constants/userService';

export class UserController {
  private userService: UserService;
  public router: Router;

  constructor(prisma: PrismaClient) {
    this.userService = new UserService(prisma);
    this.router = this.buildRoutes();
  }

  // handle HTTP requests
  private buildRoutes(): Router {
    return new RouteBuilder()
      .setAuthMiddleware(createAuthMiddleware())
      .addRoutes([
        {
          method: 'post',
          path: '/auth/register',
          handler: this.register.bind(this),
          middleware: [
            createRateLimit(5, 15 * 60 * 1000) // 5 request per 15 min
          ]
        },
        {
          method: 'post',
          path: '/auth/login',
          handler: this.login.bind(this),
          middleware: [
            createRateLimit(5, 15 * 60 * 1000) // 5 request per 15 min
          ]
        },
        {
          method: 'get',
          path: '/profile',
          handler: this.getProfile.bind(this),
          auth: true
        },
        {
          method: 'put',
          path: '/profile',
          handler: this.updateProfile.bind(this),
          auth: true
        }
      ])
      .build();
  }

  private async register(req: Request, res: Response): Promise<void> {
    const registrationData: RegisterRequest = req.body;

    const result = await this.userService.register(registrationData);

    ResponseHelper.created(res, result, USER_SERVICE.MESSAGES.REGISTRATION_SUCCESS);
  }

  private async login(req: Request, res: Response): Promise<void> {
    const loginData: LoginRequest = req.body;

    const result = await this.userService.login(loginData);
    ResponseHelper.success(res, result, USER_SERVICE.MESSAGES.LOGIN_SUCCESS);
  }

  private async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
      ResponseHelper.unauthorized(res);
      return;
    }

    const user = await this.userService.getUserByPublicId(userId);

    if (!user) {
      ResponseHelper.notFound(res, 'User not found');
      return;
    }

    ResponseHelper.success(res, { user });
  }

  private async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    const updatedData: UserUpdateData = req.body;

    if (!userId) {
      ResponseHelper.unauthorized(res);
      return;
    }

    const updateUser = await this.userService.updateUser(userId, updatedData);
    ResponseHelper.success(res, { user: updateUser }, USER_SERVICE.MESSAGES.PROFILE_UPDATED);
  }
}
