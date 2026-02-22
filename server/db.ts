import Database from "better-sqlite3";

const db = new Database("ecommerce.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    image_url TEXT,
    category_id TEXT,
    stock INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
`);

// Seed data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const categories = [
    { id: "1", name: "T-Shirts", slug: "t-shirts" },
    { id: "2", name: "Polos", slug: "polos" },
    { id: "3", name: "Dress Shirts", slug: "dress-shirts" },
    { id: "4", name: "Hoodies", slug: "hoodies" },
  ];

  const insertCategory = db.prepare("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)");
  categories.forEach(c => insertCategory.run(c.id, c.name, c.slug));

  const products = [
    {
      id: "p1",
      name: "Essential Supima T-Shirt",
      description: "Crafted from 100% long-staple Supima cotton for unparalleled softness and durability. A perfect foundation for any outfit.",
      price: 45.00,
      original_price: 55.00,
      image_url: "https://picsum.photos/seed/tshirt1/800/800",
      category_id: "1",
      stock: 50,
      rating: 4.9,
      reviews_count: 342,
      is_featured: 1
    },
    {
      id: "p2",
      name: "Pique Performance Polo",
      description: "Breathable cotton-blend pique with a touch of stretch. Moisture-wicking technology keeps you cool from the office to the green.",
      price: 75.00,
      original_price: 95.00,
      image_url: "https://picsum.photos/seed/polo1/800/800",
      category_id: "2",
      stock: 30,
      rating: 4.8,
      reviews_count: 156,
      is_featured: 1
    },
    {
      id: "p3",
      name: "Oxford Button-Down Shirt",
      description: "A timeless classic. Made from heavy-weight cotton oxford fabric that gets better with every wash. Tailored fit.",
      price: 95.00,
      original_price: null,
      image_url: "https://picsum.photos/seed/oxford/800/800",
      category_id: "3",
      stock: 25,
      rating: 4.7,
      reviews_count: 89,
      is_featured: 0
    },
    {
      id: "p4",
      name: "Heavyweight French Terry Hoodie",
      description: "Ultra-thick 400GSM French Terry cotton. Features a structured hood and hidden side pockets for a clean silhouette.",
      price: 120.00,
      original_price: 150.00,
      image_url: "https://picsum.photos/seed/hoodie1/800/800",
      category_id: "4",
      stock: 20,
      rating: 4.9,
      reviews_count: 210,
      is_featured: 1
    },
    {
      id: "p5",
      name: "Linen Summer Shirt",
      description: "100% Italian linen. Lightweight and naturally cooling, perfect for tropical climates and summer getaways.",
      price: 85.00,
      original_price: null,
      image_url: "https://picsum.photos/seed/linen/800/800",
      category_id: "3",
      stock: 15,
      rating: 4.6,
      reviews_count: 45,
      is_featured: 0
    },
    {
      id: "p6",
      name: "Graphic Artist Tee",
      description: "Limited edition collaboration featuring minimalist line art. Screen-printed on our signature heavyweight cotton base.",
      price: 55.00,
      original_price: 65.00,
      image_url: "https://picsum.photos/seed/graphic/800/800",
      category_id: "1",
      stock: 40,
      rating: 4.8,
      reviews_count: 128,
      is_featured: 1
    },
    {
      id: "p7",
      name: "Merino Wool Polo",
      description: "Fine-gauge Australian Merino wool. Naturally odor-resistant and temperature-regulating. The ultimate luxury basic.",
      price: 110.00,
      original_price: 135.00,
      image_url: "https://picsum.photos/seed/merino/800/800",
      category_id: "2",
      stock: 12,
      rating: 4.9,
      reviews_count: 67,
      is_featured: 0
    },
    {
      id: "p8",
      name: "Oversized Street Hoodie",
      description: "Dropped shoulders and a boxy fit. Made from premium brushed-back fleece for maximum comfort and a modern look.",
      price: 130.00,
      original_price: 160.00,
      image_url: "https://picsum.photos/seed/street/800/800",
      category_id: "4",
      stock: 18,
      rating: 4.7,
      reviews_count: 92,
      is_featured: 0
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, description, price, original_price, image_url, category_id, stock, rating, reviews_count, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach(p => insertProduct.run(
    p.id, p.name, p.description, p.price, p.original_price, p.image_url, p.category_id, p.stock, p.rating, p.reviews_count, p.is_featured
  ));
}

export default db;
