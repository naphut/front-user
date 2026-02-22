import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, ChevronRight, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        
        // Fetch related products from same category
        const related = await getProducts({ category: data.category_id });
        setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-black/5 rounded-[40px]" />
          <div className="space-y-8">
            <div className="h-4 bg-black/5 rounded w-1/4" />
            <div className="h-12 bg-black/5 rounded w-3/4" />
            <div className="h-6 bg-black/5 rounded w-1/2" />
            <div className="h-32 bg-black/5 rounded w-full" />
            <div className="h-16 bg-black/5 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="text-black/60 hover:text-black mt-4 inline-block underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-black transition">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-[40px] overflow-hidden bg-black/5"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.original_price && (
              <div className="absolute top-8 left-8 bg-black text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                Save ${(product.original_price - product.price).toFixed(2)}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-xs font-bold text-black/40 uppercase tracking-widest mb-2 block">
                {product.category_name}
              </span>
              <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-black fill-black' : 'text-black/10'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-black/40">({product.reviews_count} Reviews)</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-black">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <span className="text-xl text-black/30 line-through">${product.original_price.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-green-600 font-bold mt-2">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            <p className="text-lg text-black/60 leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-black/5 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white rounded-xl transition"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={cn(
                    "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 group shadow-lg",
                    isAdded ? "bg-green-500 text-white" : "bg-black text-white hover:bg-black/80"
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "w-14 h-14 border border-black/10 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white shadow-sm",
                    isWishlisted ? "text-red-500 border-red-100" : "text-black hover:bg-black/5"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isWishlisted && "fill-current")} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/5">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-5 h-5 mb-2 text-black/40" />
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-5 h-5 mb-2 text-black/40" />
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-5 h-5 mb-2 text-black/40" />
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <h2 className="text-3xl font-bold text-black mb-12">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
