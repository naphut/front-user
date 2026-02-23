const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface UserProfile {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  profile_image?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
};

export const userApi = {
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  async updateProfile(profileData: UserProfile) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    return handleResponse(response);
  },

  async getUser(id: number) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  }
};