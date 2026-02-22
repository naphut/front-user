import { z } from "zod";

// Equivalent to a Pydantic model in FastAPI
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  original_price: z.number().nullable(),
  image_url: z.string().url(),
  category_id: z.string(),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
  reviews_count: z.number().int().nonnegative(),
  is_featured: z.boolean()
});

export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string()
});

export type Category = z.infer<typeof CategorySchema>;
