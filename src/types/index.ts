export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  stock: number;
  sku?: string;
  featured: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  image_url?: string;
  category_id?: string;
  category_name?: string;
  categories?: Category[];
  images?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  profile_image?: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  payment_method: string;
  payment_status: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}