import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { API_BASE_URL } from '../services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setShowFlyer(true);
    setTimeout(() => {
      setIsAdded(false);
      setShowFlyer(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-black/5 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-black/5">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          {product.images && product.images.length > 0 ? (
            <img
              src={`${API_BASE_URL.replace('/api', '')}${product.images.find((img) => img.is_primary)?.url || product.images[0].url}`}
              alt={product.images.find((img) => img.is_primary)?.alt_text || product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-black/5 flex items-center justify-center">
              <div className="text-black/20 text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {product.compare_price && (
            <div className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Sale
            </div>
          )}
          {product.featured && (
            <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-black/10">
              Featured
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            isWishlisted 
              ? "bg-red-500 text-white shadow-lg shadow-red-200" 
              : "bg-white/80 backdrop-blur-md text-black/40 hover:text-black shadow-sm"
          )}
        >
          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-xl",
              isAdded ? "bg-green-500 text-white" : "bg-black text-white hover:bg-black/80"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Flying Icon Animation */}
        <AnimatePresence>
          {showFlyer && (
            <motion.div
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ 
                x: [0, 100, 200], 
                y: [0, -200, -400], 
                scale: [1, 0.5, 0],
                opacity: [1, 1, 0] 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1 truncate">
              {product.categories && product.categories.length > 0 
                ? product.categories[0].name 
                : product.category_name || 'Uncategorized'
              }
            </p>
            <Link to={`/products/${product.id}`}>
              <h3 className="text-base font-semibold text-black group-hover:text-black/70 transition truncate">
                {product.name}
              </h3>
            </Link>
          </div>
          <div className="flex items-center space-x-1 bg-black/5 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
            <Star className="w-3 h-3 text-black fill-black" />
            <span className="text-[10px] font-bold">{product.rating || '0.0'}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-xs text-black/30 line-through">${product.compare_price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Mobile-only cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={cn(
              "md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isAdded ? "bg-green-500 text-white" : "bg-black text-white"
            )}
          >
            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
