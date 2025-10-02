import { hashPassword, comparePassword } from '../../shared/utils/password';
import { generateToken } from '../../shared/utils/jwtToken';
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername
} from '../../shared/utils/validateString';

import type { RegisterRequest, LoginRequest, UserUpdateData, UserResponse } from './user.types';
import { User, PrismaClient } from '../../generated/prisma';

import USER_SERVICE from '../../shared/constants/userService';

export class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(data: RegisterRequest): Promise<{ token: string; user: UserResponse }> {
    const { password, username, email, display_name } = data;
    // Validate data
    this.validateRegistrationData(data);

    // Check if user exists
    await this.checkUserExists(username, email);

    // Create user
    const hashedPassword = await hashPassword(password);
    const user: User = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name
      }
    });

    const token = generateToken(user.public_id);
    return {
      token,
      user: this.formatUserResponse(user)
    };
  }

  async login(data: LoginRequest): Promise<{ token: string; user: UserResponse }> {
    if (!validateEmail(data.email)) {
      throw new Error(USER_SERVICE.ERRORS.INVALID_EMAIL_FORMAT);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error(USER_SERVICE.ERRORS.USER_NOT_FOUND);
    }

    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error(USER_SERVICE.ERRORS.PASSWORD_NOT_MATCHED);
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() }
    });

    const token = generateToken(user.public_id);
    return {
      token,
      user: this.formatUserResponse(user)
    };
  }

  async getUserByPublicId(publicId: string): Promise<UserResponse | null> {
    const user: User = await this.prisma.user.findUnique({
      where: { public_id: publicId }
    });

    return user ? this.formatUserResponse(user) : null;
  }

  async updateUser(publicId: string, data: UserUpdateData): Promise<UserResponse> {
    this.validateUpdateData(data);

    const sanitizedData = this.sanitizeUpdateData(data);

    const existingUser = await this.prisma.user.findUnique({
      where: { public_id: publicId }
    });

    if (!existingUser) {
      throw new Error(USER_SERVICE.ERRORS.USER_NOT_FOUND);
    }

    const user = await this.prisma.user.update({
      where: { public_id: publicId },
      data: sanitizedData
    });

    return this.formatUserResponse(user);
  }

  private validateRegistrationData(data: RegisterRequest): void {
    // Check required fields
    if (!data.username || !data.email || !data.password || !data.display_name) {
      throw new Error(USER_SERVICE.ERRORS.MISSING_REQUIRED_FIELDS);
    }

    // Validate username
    const usernameError = validateUsername(data.username);
    if (usernameError) {
      throw new Error(usernameError);
    }

    const passwordError = validatePassword(data.password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    const isValidEmail = validateEmail(data.email);
    if (!isValidEmail) {
      throw new Error(USER_SERVICE.ERRORS.INVALID_EMAIL_FORMAT);
    }

    const displayNameError = validateDisplayName(data.display_name);
    if (displayNameError) {
      throw new Error(displayNameError);
    }
  }

  private async checkUserExists(username: string, email: string): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error(USER_SERVICE.ERRORS.USERNAME_EXISTS);
      }
      if (existingUser.email === email) {
        throw new Error(USER_SERVICE.ERRORS.EMAIL_EXISTS);
      }
    }
  }

  private formatUserResponse(user: User): UserResponse {
    return {
      id: user.public_id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      created_at: user.created_at.toDateString(),
      last_login: user.last_login
    };
  }

  private validateUpdateData(data: UserUpdateData): void {
    if (!data || Object.keys(data).length === 0) {
      throw new Error(USER_SERVICE.ERRORS.NO_UPDATED_DATA);
    }

    // Validate display_name if provided
    const displayNameError = validateDisplayName(data.display_name);
    if (displayNameError) {
      throw new Error(displayNameError);
    }

    // Validate avatar_url if provided
    if (data.avatar_url !== undefined && data.avatar_url) {
      if (!this.isValidUrl(data.avatar_url)) {
        throw new Error(USER_SERVICE.ERRORS.INVALID_AVATAR_URL);
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private sanitizeUpdateData(data: UserUpdateData): Partial<UserUpdateData> {
    const allowedFields: (keyof UserUpdateData)[] = ['display_name', 'avatar_url'];
    const sanitized: Partial<UserUpdateData> = {};

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        sanitized[field] = data[field];
      }
    });

    if (Object.keys(sanitized).length === 0) {
      throw new Error(USER_SERVICE.ERRORS.NO_UPDATED_DATA);
    }

    return sanitized;
  }
}
