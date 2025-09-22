import { AUTH_ERRORS } from '../constants/home';
import { hasSpaces } from './string';

export const validateUsernameInput = (username: string): string | null => {
  if (!username) {
    return AUTH_ERRORS.NO_USERNAME;
  }

  if (username.length < 5) {
    return AUTH_ERRORS.NO_MATCH_RULES.LENGTH;
  }

  if (hasSpaces(username)) {
    return AUTH_ERRORS.NO_MATCH_RULES.SPACE;
  }

  return null;
};
