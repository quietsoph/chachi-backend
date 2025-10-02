import USER_SERVICE from '../constants/userService';

export const hasSpaces = (text: string): boolean => {
  return /\s/.test(text);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return USER_SERVICE.ERRORS.PASSWORD_TOO_SHORT;
  if (!/(?=.*[a-z])/.test(password)) return USER_SERVICE.ERRORS.PASSWORD_NO_LOWERCASE;
  if (!/(?=.*[A-Z])/.test(password)) return USER_SERVICE.ERRORS.PASSWORD_NO_UPPERCASE;
  if (!/(?=.*\d)/.test(password)) return USER_SERVICE.ERRORS.PASSWORD_NO_NUMBER;
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (/(?=.*\s)/.test(username)) return USER_SERVICE.ERRORS.USERNAME_NO_SPACES;
  if (
    username.length < USER_SERVICE.VALIDATION.USERNAME_MIN_LENGTH ||
    username.length > USER_SERVICE.VALIDATION.USERNAME_MAX_LENGTH
  )
    return USER_SERVICE.ERRORS.USERNAME_LENGTH;
  return null;
};

export const validateDisplayName = (displayName: string): string | null => {
  if (displayName !== undefined) {
    if (!displayName.trim()) {
      throw new Error(USER_SERVICE.ERRORS.NO_DISPLAY_NAME);
    }
    if (displayName.length > 50) {
      throw new Error(USER_SERVICE.ERRORS.TOO_LONG_DISPLAY_NAME);
    }
  }

  return null;
};
