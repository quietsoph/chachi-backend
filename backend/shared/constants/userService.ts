const USER_SERVICE = {
  ERRORS: {
    // Validation errors
    MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
    INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
    USERNAME_NO_SPACES: 'Username cannot contain spaces or special characters',
    USERNAME_LENGTH: 'Username must be between 3 and 15 characters',
    NO_UPDATED_DATA: 'No valid data provided for update',
    NO_DISPLAY_NAME: 'Display name cannot be empty',
    TOO_LONG_DISPLAY_NAME: 'Display name cannot exceed 50 characters',
    INVALID_AVATAR_URL: 'Invalid avatar URL format',

    // User existence errors
    USERNAME_EXISTS: 'This username is already taken. Please choose a different one',
    EMAIL_EXISTS: 'An account with this email already exists. Try logging in instead',

    // Authentication errors
    PASSWORD_NOT_MATCHED: 'Password is incorrect. Please try again',
    USER_NOT_FOUND: 'No account found with this email address',
    ACCOUNT_DISABLED: 'Your account has been temporarily disabled. Contact support for help',

    // Password errors
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORD_NO_LOWERCASE: 'Password must contain at least one lowercase letter',
    PASSWORD_NO_UPPERCASE: 'Password must contain at least one uppercase letter',
    PASSWORD_NO_NUMBER: 'Password must contain at least one number'
  },

  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 15,
    PASSWORD_MIN_LENGTH: 8
  },

  MESSAGES: {
    // Success messages
    REGISTRATION_SUCCESS: 'Account created successfully! Welcome aboard',
    LOGIN_SUCCESS: 'Welcome back! You have been logged in successfully',
    PROFILE_UPDATED: 'Your profile has been updated successfully',
    PASSWORD_CHANGED: 'Your password has been changed successfully',

    // Info messages
    LOGOUT_SUCCESS: 'You have been logged out successfully'
  }
};

export default USER_SERVICE;
