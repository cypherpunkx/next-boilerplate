export type UserRole = "admin" | "manager" | "user";

export type Permission =
  | "users:read"
  | "users:write"
  | "users:delete"
  | "dashboard:view"
  | "settings:manage";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  user: User;
  tokens: AuthTokens;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "users:read",
    "users:write",
    "users:delete",
    "dashboard:view",
    "settings:manage",
  ],
  manager: [
    "users:read",
    "users:write",
    "dashboard:view",
  ],
  user: [
    "dashboard:view",
  ],
};
