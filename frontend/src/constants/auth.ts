export const DEFAULT_TIMEOUT = 10000;
export const TIMEOUT = 'Connection timeout. Please try again';
export const AUTH_ACTIONS = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
}

export const AUTH_ERRORS = {
  NO_CONNECTION: 'Connections not established',
  NO_USERNAME: 'Username is required',
  USED_USERNAME: 'Username used. Choose another',
  NO_MATCH_RULES: {
    LENGTH: 'Username must have at least 5 characters',
    SPACE: 'Username must not have any spaces'
  }
}

export const FORM_CONTENT = {
  TITLE: 'Join Chat',
  SUBTITLE: 'Enter your username to start chatting with friends',
  INPUT: {
    PLACEHOLDER: 'For example: hue_nguyen',
    USERNAME_RULES: 'Username must be at least 5 characters with no spaces'
  },
  BUTTON: {
    TEXT: 'Join Chat',
    LOADING: 'Loading...',
  }
}
