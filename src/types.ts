export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price: number | null;
  images: ProductImage[];
  categories: Category[];
  category_name?: string;
  stock: number;
  rating?: number;
  reviews_count?: number;
  featured: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  product_id: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
