// src/services/AuthService.ts
import apiClient from './ApiClient';
import type { User, AuthResponse } from '../types';

class AuthService {
  private readonly tokenKey = 'jwt_token';
  private readonly userKey = 'user_data';

  async login(email: string, password: string, remember_me: boolean = false): Promise<AuthResponse> {
    // Menggunakan apiClient.post (baseURL sudah otomatis dihandle oleh apiClient)
    const { data } = await apiClient.post<AuthResponse>('/login', { email, password, remember_me });
    return data;
  }

  async googleLogin(token: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/google-login', { token });
    return data;
  }

  async signUp(name: string, email: string, password: string): Promise<AuthResponse> {
    // Memanggil endpoint /signUp sesuai dengan route Slim
    const { data } = await apiClient.post<AuthResponse>('/signUp', {
      name,
      email,
      password
    });
    return data;
  }

  setSession(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  forgotPassword(email: string) {
    return apiClient.post('/forgot-password', { email });
  }

  verifyPin(email: string, pin: number) {
    return apiClient.post('/verify-pin', { email, pin });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}

export default new AuthService();