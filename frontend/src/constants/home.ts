export const ADD_FRIEND_CONTENT = {
  TITLE: 'Add Friend',
  INPUT: {
    PLACEHOLDER: 'Enter friend\'s username'
  },
  BUTTON: {
    TEXT: 'Add'
  }
}

export const CHAT_LIST_CONTENT = {
  TITLE: 'Chats'
}

export const HOME_ERRORS = {
  EMPTY_USERNAME: 'Please enter a username',
  SELF_ADD: 'You cannot add yourself as a friend',
  USERNAME_TOO_SHORT: 'Username must have at least 5 characters',
  USERNAME_HAS_SPACES: 'Username cannot have spaces',
  FRIEND_ALREADY_ADDED: 'Friend already added'
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

export const HOME_CONTENT = {
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
