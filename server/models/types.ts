export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category_id: string;
  category_name?: string;
  stock: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
}
