export const SEARCH_FRIEND_ERRORS = {
  NO_NAME: 'Please enter a username',
  SELF_CHAT: 'You cannot add yourself as a friend',
  TOO_SHORT: 'Username must be at least 5 characters',
  SPACES: 'Username cannot have spaces'
};

export const CHAT_CONTENT = {
  TYPING: {
    INDICATOR: ' is typing...'
  },
  INPUT: {
    PLACEHOLDER: 'Type your message...'
  },
  BUTTON: {
    SEND: 'Send'
  },
  NO_CHAT_SELECTED: {
    MOBILE: 'Tap menu to select a friend',
    DESKTOP: 'Select a friend to start chatting'
  }
};

export const CHAT_STYLES = {
  ICON_SIZE: {
    MOBILE: 48,
    DESKTOP: 64
  },
  ICON_COLOR: '#ccc',
  TEXTAREA: {
    MIN_ROWS: 1,
    MAX_ROWS: {
      MOBILE: 2,
      DESKTOP: 3
    },
    FONT_SIZE: {
      MOBILE: '16px',
      DESKTOP: '14px'
    },
    TOUCH_ACTION: 'manipulation'
  }
};
