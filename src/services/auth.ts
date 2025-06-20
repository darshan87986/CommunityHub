import { createApiClient } from './apiclient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'organizer' | 'attendee';
}

const api = createApiClient();

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return api.post('/auth/login', credentials);
  },

  register: async (data: RegisterData) => {
    return api.post('/auth/register', data);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};