const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface UserProfile {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  profile_image?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  profile_image?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to handle response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
};

export const userApi = {
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  async updateProfile(profileData: UserProfile): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return handleResponse(response);
  },
};
