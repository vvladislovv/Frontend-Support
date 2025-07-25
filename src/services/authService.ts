import axios from 'axios';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile as apiGetProfile } from '../api';
import type { User } from '../types';

// Auth Service
export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(email: string, password: string) {
    const result = await apiLogin(email, password);
    
    if (result.access_token) {
      this.setAuthHeader(result.access_token);
    }
    
    return result;
  }

  async register(email: string, password: string, name: string, ref?: string) {
    const result = await apiRegister(email, password, name, ref);
    
    if (result.access_token) {
      this.setAuthHeader(result.access_token);
    }
    
    return result;
  }

  async logout() {
    try {
      await apiLogout();
    } finally {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  async getProfile(): Promise<User> {
    return await apiGetProfile();
  }

  private setAuthHeader(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  initializeAuth() {
    const token = localStorage.getItem('token');
    if (token && !token.startsWith('mock-')) {
      this.setAuthHeader(token);
    }
  }
}

export const authService = AuthService.getInstance();