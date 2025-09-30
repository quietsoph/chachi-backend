import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { UserService } from '../../services/user/user.service';
import { testPrisma } from '../setup';
import type { RegisterRequest, LoginRequest } from '../../services/user/user.types';
import USER_SERVICE from '../../shared/constants/userService';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService(testPrisma);
  });

  describe('register', () => {
    const validRegistrationData: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      display_name: 'Test User'
    };

    test('should register a new user successfully', async () => {
      const result = await userService.register(validRegistrationData);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password'); // Ensure password is not exposed
    });

    test('should throw error for missing required fields', async () => {
      const invalidData = { ...validRegistrationData, username: '' };

      await expect(userService.register(invalidData)).rejects.toThrow(USER_SERVICE.ERRORS.MISSING_REQUIRED_FIELDS);
    });

    test('should throw error for invalid email format', async () => {
      const invalidData = { ...validRegistrationData, email: 'invalid-email' };

      await expect(userService.register(invalidData)).rejects.toThrow(USER_SERVICE.ERRORS.INVALID_EMAIL_FORMAT);
    });

    test('should throw error for username with spaces', async () => {
      const invalidData = { ...validRegistrationData, username: 'test user' };

      await expect(userService.register(invalidData)).rejects.toThrow();
    });

    test('should throw error for weak password', async () => {
      const invalidData = { ...validRegistrationData, password: '123' };

      await expect(userService.register(invalidData)).rejects.toThrowError();
    });

    test('should throw error for duplicate username', async () => {
      await userService.register(validRegistrationData);

      const duplicateData = {
        ...validRegistrationData,
        email: 'different@example.com'
      };

      await expect(userService.register(duplicateData)).rejects.toThrow(USER_SERVICE.ERRORS.USERNAME_EXISTS);
    });

    test('should throw error for duplicate email', async () => {
      await userService.register(validRegistrationData);

      const duplicateData = {
        ...validRegistrationData,
        username: 'differentuser'
      };

      await expect(userService.register(duplicateData)).rejects.toThrow(USER_SERVICE.ERRORS.EMAIL_EXISTS);
    });
  });

  describe('login', () => {
    const registrationData: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      display_name: 'Test User'
    };

    beforeEach(async () => {
      await userService.register(registrationData);
    });

    test('should login successfully with correct credentials', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'Test123!'
      };

      const result = await userService.login(loginData);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
    });

    test('should throw error for invalid email format', async () => {
      const loginData: LoginRequest = {
        email: 'invalid-email',
        password: 'Test123!'
      };

      await expect(userService.login(loginData)).rejects.toThrow(USER_SERVICE.ERRORS.INVALID_EMAIL_FORMAT);
    });

    test('should throw error for non-existent user', async () => {
      const loginData: LoginRequest = {
        email: 'nonexistent@example.com',
        password: 'Test123!'
      };

      await expect(userService.login(loginData)).rejects.toThrow(USER_SERVICE.ERRORS.USER_NOT_FOUND);
    });

    test('should throw error for incorrect password', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'WrongPassword!'
      };

      await expect(userService.login(loginData)).rejects.toThrow(USER_SERVICE.ERRORS.PASSWORD_NOT_MATCHED);
    });

    test('should update last_login timestamp on successful login', async () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'Test123!'
      };

      const beforeLogin = new Date();
      await userService.login(loginData);

      const user = await testPrisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(user?.last_login).toBeDefined();
      expect(user?.last_login!.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
    });
  });

  describe('getUserByPublicId', () => {
    let userPublicId: string;

    beforeEach(async () => {
      const result = await userService.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        display_name: 'Test User'
      });
      userPublicId = result.user.id;
    });

    test('should return user for valid public ID', async () => {
      const user = await userService.getUserByPublicId(userPublicId);

      expect(user).toBeDefined();
      expect(user?.username).toBe('testuser');
    });

    test('should return null for invalid public ID', async () => {
      const user = await userService.getUserByPublicId('invalid-id');

      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    let userPublicId: string;

    beforeEach(async () => {
      const result = await userService.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
        display_name: 'Test User'
      });
      userPublicId = result.user.id;
    });

    test('should update user display name successfully', async () => {
      const updateData = { display_name: 'Updated Name' };

      const updatedUser = await userService.updateUser(userPublicId, updateData);

      expect(updatedUser.display_name).toBe('Updated Name');
    });

    test('should update user avatar URL successfully', async () => {
      const updateData = { avatar_url: 'https://example.com/avatar.jpg' };

      const updatedUser = await userService.updateUser(userPublicId, updateData);

      expect(updatedUser.avatar_url).toBe('https://example.com/avatar.jpg');
    });

    test('should throw error for empty update data', async () => {
      await expect(userService.updateUser(userPublicId, {})).rejects.toThrow(USER_SERVICE.ERRORS.NO_UPDATED_DATA);
    });

    test('should throw error for invalid avatar URL', async () => {
      const updateData = { avatar_url: 'invalid-url' };

      await expect(userService.updateUser(userPublicId, updateData)).rejects.toThrow(
        USER_SERVICE.ERRORS.INVALID_AVATAR_URL
      );
    });

    test('should throw error for non-existent user', async () => {
      const updateData = { display_name: 'Updated Name' };

      await expect(userService.updateUser('invalid-id', updateData)).rejects.toThrow(
        USER_SERVICE.ERRORS.USER_NOT_FOUND
      );
    });
  });
});
