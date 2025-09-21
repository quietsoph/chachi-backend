export interface User {
  username: string;
  socketId: string;
  joinedAt: Date;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  delivered: boolean;
}

export interface UserJoinData {
  username: string;
}

export interface PrivateMessageData {
  to: string;
  content: string;
}
