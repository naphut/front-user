import { Request, Response } from "express";
import db from "../db";
import { ProductSchema } from "../models/schemas";

export const getCategories = (req: Request, res: Response) => {
  try {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getProducts = (req: Request, res: Response) => {
  try {
    const { category, search, sort, featured } = req.query;
    let query = "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1";
    const params: any[] = [];

    if (category) {
      query += " AND p.category_id = ?";
      params.push(category);
    }

    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (featured === "true") {
      query += " AND p.is_featured = 1";
    }

    // Sorting logic...
    if (sort === "price_low") query += " ORDER BY p.price ASC";
    else if (sort === "price_high") query += " ORDER BY p.price DESC";
    else if (sort === "rating") query += " ORDER BY p.rating DESC";
    else query += " ORDER BY p.id DESC";

    const products = db.prepare(query).all(...params);
    
    // Optional: Validate output like FastAPI's response_model
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = (req: Request, res: Response) => {
  try {
    const product = db.prepare("SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?").get(req.params.id);
    
    if (product) {
      // Map 0/1 from SQLite to boolean for the schema
      const formattedProduct = {
        ...product,
        is_featured: !!product.is_featured
      };
      
      // Strict validation like FastAPI
      const validated = ProductSchema.parse(formattedProduct);
      res.json(validated);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
