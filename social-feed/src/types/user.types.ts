// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  verified?: boolean;
  bio?: string;
  followers?: number;
  following?: number;
}