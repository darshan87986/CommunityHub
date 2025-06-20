// Create new file: src/services/apiClient.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }

  const data = await response.json();
  
  if (!response.ok) {
    const error = data?.error || 'Something went wrong';
    throw new Error(error);
  }

  return data;
};

export const createApiClient = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    get: async (endpoint: string) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { 
          headers,
          credentials: 'include' // For cookies if needed
        });
        return handleResponse(response);
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    post: async (endpoint: string, data: any) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    put: async (endpoint: string, data: any) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (endpoint: string) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers
      });
      return handleResponse(response);
    }
  };
};