// src/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  message?: string;
  user: User;
}

export interface TicketStats {
  applied: number | string;
  progress: number | string;
  completed: number | string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}