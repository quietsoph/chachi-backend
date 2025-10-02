export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  display_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  last_login?: Date;
}

export interface AuthResponse {
  message: string;
  password: string;
  display_name: string;
}

export interface UserCreateData extends RegisterRequest {}

export interface UserUpdateData {
  display_name?: string;
  avatar_url?: string;
}
