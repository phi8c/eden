export interface User {
  id: number;
  username: string;
  email: string;
  status?: string;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  userId: number;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface CurrentUserResponse {
  user: User;
  profile: UserProfile | null;
}
