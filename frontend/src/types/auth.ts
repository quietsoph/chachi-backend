export interface AuthState {
  currentUser: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface JoinChatOptions {
  username: string;
  timeout?: number;
}