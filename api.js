// កំណត់ URL របស់ Backend - ប្ដូរតាម URL ដែល Render ផ្ដល់ឱ្យ
const API_URL = process.env.REACT_APP_API_URL || 'https://backend-ecomerce-shirt.onrender.com/api';

// ឬប្រើអថេរបរិស្ថានផ្សេងគ្នាសម្រាប់ Development/Production
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000/api';
  }
  // Production - ប្ដូរតាម URL របស់ Render
  return 'https://backend-ecomerce-shirt.onrender.com/api';
};

const API_BASE_URL = getApiUrl();

// ឧទាហរណ៍នៃការប្រើប្រាស់
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return response.json();
};

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};