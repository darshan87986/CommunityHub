// Create new file: src/services/api.ts
const BASE_URL = 'http://localhost:5000/api';

// Define the RegisterData type
export interface RegisterData {
  email: string;
  password: string;
  username?: string; // Add other fields as needed
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return res.json();
    },
    register: async (data: RegisterData) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  }
};