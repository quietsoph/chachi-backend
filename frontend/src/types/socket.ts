import { UserJoinData, PrivateMessageData, Message } from './chat';

export interface ClientToServerEvents {
  user_join: (data: UserJoinData) => void;
  send_private_message: (data: PrivateMessageData) => void;
  typing_start: (targetUser: string) => void;
  typing_stop: (targetUser: string) => void;
}

export interface ServerToClientEvents {
  auth_success: (username: string) => void;
  user_joined: (username: string) => void;
  user_left: (username: string) => void;
  online_users: (users: string[]) => void;
  receive_private_message: (message: Message) => void;
  user_typing: (data: { from: string; isTyping: boolean }) => void;
  error: (error: string) => void;
}
