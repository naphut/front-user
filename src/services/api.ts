import { Product, Category } from '../types';

// ប្រើ environment variable ឬ default URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔗 API_BASE_URL initialized as:', API_BASE_URL);

export async function getCategories(): Promise<Category[]> {
  try {
    console.log('Fetching categories from:', `${API_BASE_URL}/categories/`);
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Categories received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw to handle in components
  }
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  sort?: string | null;
  featured?: boolean;
}): Promise<Product[]> {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.featured) searchParams.append('featured', 'true');

    const url = `${API_BASE_URL}/products/?${searchParams.toString()}`;
    console.log('Fetching products from:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    console.log('Products received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw to handle in components
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}